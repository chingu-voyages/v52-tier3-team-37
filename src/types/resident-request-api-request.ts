import { GoogleAddressData } from "@/types/google-address-data";
import { TimeSlot } from "@/types/time-slot";

// This interface defines the data that is sent to the resident-request api endpoint to create a new resident request.
export interface ResidentReqestApiRequest {
  googleAddressData: GoogleAddressData;
  name: string;
  email: string;
  appointmentDate: string;
  timeSlot: TimeSlot;
  areaCode: string;
  phoneNumber: string;
}
