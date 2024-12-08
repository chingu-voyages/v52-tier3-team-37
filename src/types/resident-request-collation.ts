export interface ResidentRequestCollation {
  id: string;
  requestedTimeSlot: { startTime: string; endTime: string }; // Time slot details
  address: {
    latitude: number; // Latitude from the database
    longitude: number; // Longitude from the database
    city: string;
    streetName?: string;
    streetNumber?: string;
    zipCode?: string;
    googleAddressComponents?: google.maps.GeocoderAddressComponent[]; // Add this if using Google Geocoding results
    geometry?: google.maps.places.PlaceGeometry; // Add this if processing geometry
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  distanceFromPrevious?: number; 
}
