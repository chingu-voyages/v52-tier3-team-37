export interface ResidentRequestCollation {
  id: string; // Unique identifier for the request
  applicantName: string;
  requestedTimeSlot: {
    id: string;
    startTime: string;
    endTime: string;
    description?: string;
  };
  assignedTimeSlot?: {
    id: string;
    startTime: string;
    endTime: string;
    description?: string;
  };
  address: {
    latitude: number; // lat num
    longitude: number; // long num
    city: string; // City name
    streetName: string; // validation: Street name
    streetNumber: string;
    zipCode: string;
    googleAddressComponents?: google.maps.GeocoderAddressComponent[];
    // validation: Address components from Google Geocoding API
    geometry?: google.maps.places.PlaceGeometry;
    //
  };
  user: {
    id: string; // Unique identifier for the user associated with the request
    name: string; // User's full name
    email: string; // User's email address
  };
  distanceFromPrevious?: number; // Optional: Distance from the previous address in meters
  routeDetails?: {
    startIndex: number; // Optional: Index of the starting point in the route
    endIndex: number; // Optional: Index of the ending point in the route
  };
  status: string; // Add this if it's part of the API response
  route?: {
    originIndex: number;
    destinationIndex: number;
    duration: string;
    condition: string;
  }; // Optional route property
  timeSlot?: string; // Add this if `timeSlot` is part of the backend response
  estimatedArrivalTime?: string;
}
