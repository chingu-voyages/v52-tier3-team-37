import { computeRouteMatrix } from "@/lib/utils/google-routes";
import { ResidentRequestCollation } from "../../types/resident-request-collation";

export async function generateOptimizedRoute(
  requests: ResidentRequestCollation[]
): Promise<ResidentRequestCollation[]> {
  if (requests.length < 2) {
    return requests; // No optimization needed
  }

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

    return requests.map((request, index) => ({
      ...request,
      route: routes.find((route) => route.originIndex === index),
    }));
  } catch (error) {
    console.error("Error optimizing routes:", error);
    throw error;
  }
}
