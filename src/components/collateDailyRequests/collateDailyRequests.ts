import { computeRouteMatrix } from "@/lib/utils/google-routes";
import { ResidentRequestCollation } from "../../types/resident-request-collation";
import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";

export async function fetchDailyRequests(): Promise<ResidentRequestCollation[]> {
  try {
    const response = await fetch("/api/request-schedule");
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching daily requests:", error);
    throw error;
  }
}

// Match time slot
function determineTimeSlot(startTime: number): TimeSlot | null {
  for (const timeSlot of Object.values(TimeSlot)) {
    const [startHour, endHour] = getTimeSlotHours(timeSlot);
    if (startTime >= startHour && startTime < endHour) {
      return timeSlot;
    }
  }
  return null; // No matching time slot
}

export async function collateDailyRequests(): Promise<Record<TimeSlot, ResidentRequestCollation[]>> {
  const requests = await fetchDailyRequests();

  // Use `Record<TimeSlot, ResidentRequestCollation[]>` for strict typing
  const groupedRequests: Record<TimeSlot, ResidentRequestCollation[]> = {
    [TimeSlot.Morning]: [],
    [TimeSlot.Daytime]: [],
    [TimeSlot.Evening]: [],
  };

  for (const request of requests) {
    if (!request.address || !request.address.latitude || !request.address.longitude) {
      console.warn(`Skipping request ${request.id} due to missing address information.`);
      continue;
    }

    const startTime = new Date(request.requestedTimeSlot.startTime).getHours();
    const timeSlot = determineTimeSlot(startTime);

    if (timeSlot) {
      groupedRequests[timeSlot].push(request);
    } else {
      console.warn(`Request ${request.id} does not fall into any defined time slot.`);
    }
  }

  // Perform route optimization for each time slot
  for (const [timeSlot, requests] of Object.entries(groupedRequests)) {
    if (requests.length > 1) {
      const locations = requests.map((req) => ({
        latitude: req.address.latitude,
        longitude: req.address.longitude,
      }));

      try {
        const routes = await computeRouteMatrix({
          origins: locations,
          destinations: locations,
          travelMode: "DRIVE",
        });

        groupedRequests[timeSlot as TimeSlot] = requests.map((request, index) => ({
          ...request,
          route: routes.find((route) => route.originIndex === index),
        }));
      } catch (error) {
        console.error(`Error optimizing routes for time slot ${timeSlot}:`, error);
      }
    }
  }

  return groupedRequests;
}
