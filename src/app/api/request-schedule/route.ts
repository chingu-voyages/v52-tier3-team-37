import { prisma } from "@/lib/prisma";
import { computeRouteMatrix } from "@/lib/utils/google-routes";
import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

interface Route {
  originIndex: number;
  destinationIndex: number;
  duration: string;
  condition: string;
}

function determineTimeSlot(
  accumulatedTime: number,
  dateContext: Date
): { startTime: Date; endTime: Date } {
  const hour = Math.floor(accumulatedTime / 3600); // Convert seconds to hours

  if (
    hour >= getTimeSlotHours(TimeSlot.Morning)[0] &&
    hour < getTimeSlotHours(TimeSlot.Morning)[1]
  )
    return {
      startTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Morning)[0])
        .toDate(),
      endTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Morning)[1])
        .toDate(),
    };
  if (
    hour >= getTimeSlotHours(TimeSlot.Daytime)[0] &&
    hour < getTimeSlotHours(TimeSlot.Daytime)[1]
  )
    return {
      startTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Daytime)[0])
        .toDate(),
      endTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Daytime)[1])
        .toDate(),
    };
  if (
    hour >= getTimeSlotHours(TimeSlot.Evening)[0] &&
    hour < getTimeSlotHours(TimeSlot.Evening)[1]
  )
    return {
      startTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Evening)[0])
        .toDate(),
      endTime: dayjs(dateContext)
        .add(1, "day")
        .set("hours", getTimeSlotHours(TimeSlot.Evening)[1])
        .toDate(),
    };

  throw new Error("Unable to determine time slot for the given hour");
}

function optimizeRoute(routeMatrix: number[][]): number[] {
  const numLocations = routeMatrix.length;
  const visited = new Set<number>();
  const order: number[] = [];
  let currentLocation = 0;

  while (order.length < numLocations) {
    visited.add(currentLocation);
    order.push(currentLocation);

    let nearestNeighbor = -1;
    let shortestDistance = Infinity;
    for (let i = 0; i < numLocations; i++) {
      if (
        !visited.has(i) &&
        routeMatrix[currentLocation][i] < shortestDistance
      ) {
        shortestDistance = routeMatrix[currentLocation][i];
        nearestNeighbor = i;
      }
    }

    if (nearestNeighbor === -1) break;
    currentLocation = nearestNeighbor;
  }

  return order;
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const { date } = requestBody;

    if (!date) {
      console.error("Missing 'date' in request body");
      return NextResponse.json(
        { error: "Missing required 'date' in request body" },
        { status: 400 }
      );
    }
    const requestStartTime = new Date(date);

    // Fetch requests for the specific date and status PENDING
    const residentRequests = await prisma.residentRequest.findMany({
      where: {
        status: "PENDING",
        requestedTimeSlot: {
          startTime: {
            gte: requestStartTime,
            lt: `${date}T23:59:59Z`,
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        requestedTimeSlot: true,
        address: true,
      },
    });

    if (residentRequests.length === 0) {
      return NextResponse.json({
        message: "No requests found for the given date.",
      });
    }

    const optimizedResults = [];

    // Process requests
    const locations = residentRequests.map((req) => ({
      latitude: req.address!.latitude,
      longitude: req.address!.longitude,
    }));

    const routes = await computeRouteMatrix({
      origins: locations,
      destinations: locations,
      travelMode: "DRIVE",
    });

    const routeMap: Record<string, Route> = routes.reduce((map, route) => {
      map[`${route.originIndex}-${route.destinationIndex}`] = route;
      return map;
    }, {} as Record<string, Route>);
    // Create a route matrix
    const routeMatrix: number[][] = Array.from(
      { length: locations.length },
      () => Array(locations.length).fill(Infinity)
    );

    routes.forEach((route) => {
      const durationInSeconds = parseInt(route.duration.replace("s", ""), 10);
      routeMatrix[route.originIndex][route.destinationIndex] =
        durationInSeconds;
    });

    // Optimize route
    const optimizedOrder = optimizeRoute(routeMatrix);

    // Start time: 8 AM
    let accumulatedTime = 8 * 60 * 60;
    const stopDuration = 60 * 60; // 1 hour per stop

    // Reorder requests, assign time slots, and persist in the database
    for (const index of optimizedOrder) {
      const currentRequest = residentRequests[index];
      const nextIndex = (index + 1) % residentRequests.length;

      const travelTime = routeMatrix[index][nextIndex];
      const timeSlot = determineTimeSlot(accumulatedTime, new Date(date));

      // Increment accumulated time by the stop duration and travel time
      accumulatedTime += stopDuration + travelTime;

      // Update the assigned time slot in the database
      const updatedRequest = await prisma.residentRequest.update({
        where: { id: currentRequest.id },
        data: {
          assignedTimeSlot: {
            create: {
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
            },
          },
        },
      });
      optimizedResults.push({
        ...updatedRequest,
        address: currentRequest.address,
        user: currentRequest.user,
        travelTime,
        estimatedArrivalTime: dayjs(timeSlot.startTime)
          .add(accumulatedTime, "s")
          .toDate(),
        route: routeMap[`${index}-${nextIndex}`],
      });
    }
    return NextResponse.json(optimizedResults);
  } catch (error) {
    console.error(
      "Error fetching or updating requests:",
      (error as Error).message
    );
    return NextResponse.json(
      { error: "request schedule failed" },
      { status: 500 }
    );
  }
}
