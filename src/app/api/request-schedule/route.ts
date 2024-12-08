import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { computeRouteMatrix } from "@/lib/utils/google-routes";
import { GoogleAddressComponentsExtractor } from "@/lib/utils/google-address-components-extractor";

export async function GET() {
  // Fetch resident requests
  const residentRequests = await prisma.residentRequest.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      requestedTimeSlot: true,
      address: true, // Include address details
    },
  });

  // Enrich addresses with mock googleAddressComponents and geometry
  const enrichedRequests = residentRequests
    .map((request) => {
      if (!request.address) {
        console.warn(`Request ${request.id} is missing address information.`);
        return null;
      }

      // Mock googleAddressComponents and geometry dynamically
      const mockGoogleAddressComponents = [
        { long_name: request.address.streetName, short_name: request.address.streetName, types: ["route"] },
        { long_name: request.address.streetNumber, short_name: request.address.streetNumber, types: ["street_number"] },
        { long_name: request.address.city, short_name: request.address.city, types: ["locality"] },
        { long_name: request.address.zipCode, short_name: request.address.zipCode, types: ["postal_code"] },
      ];

      const mockGeometry = {
        location: new google.maps.LatLng(request.address.latitude, request.address.longitude),
      };

      const extractor = new GoogleAddressComponentsExtractor(
        mockGoogleAddressComponents,
        mockGeometry as google.maps.places.PlaceGeometry
      );

      const standardizedAddress = extractor.extract();

      return {
        ...request,
        address: {
          ...request.address,
          ...standardizedAddress, // Overwrite or add standardized fields
        },
      };
    })
    .filter((req): req is NonNullable<typeof req> => !!req); // Filter out nulls

  // If there are less than two requests, skip route optimization
  if (enrichedRequests.length < 2) {
    return NextResponse.json(enrichedRequests);
  }

  // Compute route matrix
  const locations = enrichedRequests.map((req) => ({
    latitude: req.address.latitude,
    longitude: req.address.longitude,
  }));

  try {
    const routes = await computeRouteMatrix({
      origins: locations,
      destinations: locations,
      travelMode: "DRIVE",
    });

    // Append route details to enriched requests
    const updatedRequests = enrichedRequests.map((request, index) => ({
      ...request,
      route: routes.find((route) => route.originIndex === index),
    }));

    return NextResponse.json(updatedRequests);
  } catch (error) {
    console.error("Error fetching route matrix:", error);
    return NextResponse.error();
  }
}
