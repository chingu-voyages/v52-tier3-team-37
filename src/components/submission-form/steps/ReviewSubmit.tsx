/* Review and submit screen */

import { TextLabel } from "@/components/textLabel";
import { getTimeSlotSummaryCaption } from "@/lib/utils/time-slot/time-slot";
import { Address } from "@prisma/client";
import dayjs from "dayjs";
import { FormSchemaUserFormData } from "../definitions/types";

interface ReviewSubmitProps {
  formData: Partial<FormSchemaUserFormData>;
}

/* 
  This is the review and confirm step where the user can review the information they have entered:
  - Full name
  - E-mail address
  - Phone number
  - Address (TODO)
  - Appointment date and timeSlot
*/
export const ReviewSubmit = ({ formData }: ReviewSubmitProps) => {
  return (
    <>
      <TextLabel text="Review and Submit" fontSize="Text-20" color="Gray-100" />
      <TextLabel
        text="Please review the information below and tap 'Submit' to send your appointment request."
        fontSize="Text-12"
        color="Gray-100"
      />
      <div>
        <TextLabel text="Full Name:" fontSize="Text-14" color="Gray-100" />
        <TextLabel text={formData.name!} fontSize="Text-14" color="Green" />
      </div>
      <div>
        <TextLabel text="E-mail Address:" fontSize="Text-14" color="Gray-100" />
        <TextLabel text={formData.email!} fontSize="Text-14" color="Green" />
      </div>
      <div>
        <TextLabel text="Phone Number:" fontSize="Text-14" color="Gray-100" />
        <TextLabel
          text={`(${formData.areaCode})-${formData.phoneNumber}`}
          fontSize="Text-14"
          color="Green"
        />
      </div>
      <div>
        <TextLabel text="Address:" fontSize="Text-14" color="Gray-100" />
        <FormattedAddress
          address={formData.googleAddressData?.address as Partial<Address>}
        />
      </div>
      <div>
        <TextLabel
          text="Appointment Date:"
          fontSize="Text-14"
          color="Gray-100"
        />
        <TextLabel
          text={dayjs(formData.appointmentDate).format("dddd, MMMM D, YYYY")}
          fontSize="Text-14"
          color="Green"
        />
      </div>
      <div>
        <TextLabel
          text="Requested Time Slot:"
          fontSize="Text-14"
          color="Gray-100"
        />
        <TextLabel
          text={getTimeSlotSummaryCaption(formData.timeSlot!)}
          fontSize="Text-14"
          color="Green"
        />
      </div>
    </>
  );
};

const FormattedAddress = ({ address }: { address: Partial<Address> }) => {
  return (
    <div>
      <TextLabel
        text={`${address.streetNumber} ${address.streetName}`}
        fontSize="Text-14"
        color="Green"
      />

      <TextLabel
        text={`${address.city}, ${address.zipCode}`}
        fontSize="Text-14"
        color="Green"
      />
    </div>
  );
};
