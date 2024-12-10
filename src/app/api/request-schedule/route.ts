import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { computeRouteMatrix } from "@/lib/utils/google-routes";

function optimizeRoute(routeMatrix: Array<Array<number>>): number[] {
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
      if (!visited.has(i) && routeMatrix[currentLocation][i] < shortestDistance) {
        shortestDistance = routeMatrix[currentLocation][i];
        nearestNeighbor = i;
      }
    }

    if (nearestNeighbor === -1) break;
    currentLocation = nearestNeighbor;
  }

  return order;
}

export async function GET() {
  try {
    // Step 1: Fetch only pending resident requests
    const residentRequests = await prisma.residentRequest.findMany({
      where: { status: "PENDING" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        requestedTimeSlot: true,
        address: true,
      },
    });

    // Step 2: Group requests by day
    const requestsByDay = residentRequests.reduce((acc, request) => {
      if (!request.address) return acc; // Skip requests with null addresses
      const day = new Date(request.requestedTimeSlot.startTime).toISOString().split("T")[0];
      acc[day] = acc[day] || [];
      acc[day].push(request);
      return acc;
    }, {} as Record<string, typeof residentRequests>);

    const optimizedResults = [];

    for (const [day, requests] of Object.entries(requestsByDay)) {
      if (requests.length < 2) {
        optimizedResults.push(...requests);
        continue;
      }

      // Extract locations
      const locations = requests.map((req) => ({
        latitude: req.address!.latitude,
        longitude: req.address!.longitude,
      }));

      // Compute route matrix
      const routes = await computeRouteMatrix({
        origins: locations,
        destinations: locations,
        travelMode: "DRIVE",
      });

      if (!routes || routes.length === 0) {
        console.error(`Route optimization failed for day: ${day}`);
        optimizedResults.push(...requests);
        continue;
      }

      // Create route matrix
      const routeMatrix = Array.from({ length: locations.length }, () =>
        Array(locations.length).fill(Infinity)
      );

      routes.forEach((route) => {
        routeMatrix[route.originIndex][route.destinationIndex] = route.duration;
      });

      // Optimize route
      const optimizedOrder = optimizeRoute(routeMatrix);

      // Reorder requests
      const optimizedRequests = optimizedOrder.map((index) => ({
        ...requests[index],
        route: {
          originIndex: index,
          destinationIndex: optimizedOrder[(optimizedOrder.indexOf(index) + 1) % optimizedOrder.length],
          duration: routeMatrix[index][
            optimizedOrder[(optimizedOrder.indexOf(index) + 1) % optimizedOrder.length]
          ],
          condition: "ROUTE_EXISTS",
        },
      }));

      optimizedResults.push(...optimizedRequests);
    }

    return NextResponse.json(optimizedResults);
  } catch (error) {
    console.error("Error optimizing routes:", error);
    return NextResponse.error();
  }
}
