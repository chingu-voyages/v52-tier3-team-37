import axios from 'axios';

const GOOGLE_ROUTES_API = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';

interface LatLng {
  latitude: number;
  longitude: number;
}

interface RouteMatrixRequest {
  origins: LatLng[];
  destinations: LatLng[];
  travelMode: string; // DRIVE, BICYCLE, WALK, TRANSIT
  routingPreference?: string; // TRAFFIC_AWARE, TRAFFIC_AWARE_OPTIMAL, etc.
}

interface RouteMatrixResponse {
  originIndex: number;
  destinationIndex: number;
  distanceMeters: number;
  duration: string;
  condition: string;
}

export async function computeRouteMatrix(
  request: RouteMatrixRequest
): Promise<RouteMatrixResponse[]> {
  const body = {
    origins: request.origins.map((origin) => ({
      waypoint: { location: { latLng: origin } },
    })),
    destinations: request.destinations.map((destination) => ({
      waypoint: { location: { latLng: destination } },
    })),
    travelMode: request.travelMode,
    routingPreference: request.routingPreference || 'TRAFFIC_AWARE',
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': process.env.GOOGLEMAPS_API_KEY!,
    'X-Goog-FieldMask':
      'originIndex,destinationIndex,duration,distanceMeters,status,condition',
  };

  try {
    const response = await axios.post(GOOGLE_ROUTES_API, body, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      console.error('Error computing route matrix (Axios):', error.response?.data || error.message);
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors
      console.error('Error computing route matrix:', error.message);
    } else {
      // Handle unknown error types
      console.error('Unexpected error computing route matrix:', error);
    }
    throw error; // Re-throw the error after logging
  }
}
