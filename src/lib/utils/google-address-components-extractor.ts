import { Address } from "@prisma/client";
/* 
  This goal of this class is to extract the address components returned by the Google Maps Geocoding API
  and return an address object
  streetName   String
  streetNumber String
  city         String
  zipCode      String
  latitude     Float
  longitude    Float

*/

export class GoogleAddressComponentsExtractor {
  private addressComponents: google.maps.GeocoderAddressComponent[];
  private geometry: google.maps.places.PlaceGeometry;
  constructor(
    addressComponents: google.maps.GeocoderAddressComponent[],
    geometry: google.maps.places.PlaceGeometry
  ) {
    this.addressComponents = addressComponents;
    this.geometry = geometry;
  }

  public extract(): Partial<Address> {
    return {
      streetName: this.getStreetName(),
      streetNumber: this.getStreetNumber(),
      city: this.getCity(),
      zipCode: this.getZipCode(),
      latitude: this.getLatitude(),
      longitude: this.getLongitude(),
    };
  }

  private getStreetName() {
    return this.addressComponents.find((component) =>
      component.types.includes("route")
    )!.long_name!;
  }
  private getStreetNumber() {
    return this.addressComponents.find((component) =>
      component.types.includes("street_number")
    )!.long_name!;
  }
  private getCity() {
    return this.addressComponents.find((component) =>
      component.types.includes("locality")
    )!.long_name!;
  }
  private getZipCode() {
    return this.addressComponents.find((component) =>
      component.types.includes("postal_code")
    )!.long_name!;
  }
  private getLatitude(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.geometry.location as any).lat;
  }
  private getLongitude(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.geometry.location as any).lng;
  }
}
