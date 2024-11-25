import AddressInput from "@/components/address_input/AddressInput";
import { TextLabel } from "@/components/textLabel";
import { GoogleAddressData } from "@/types/google-address-data";
import { FormSchemaUserFormData } from "../definitions/types";

interface FormStepTwoProps {
  formData: Partial<FormSchemaUserFormData>; // TODO: Define the address type
  setFormData: { (data: Partial<FormSchemaUserFormData>): void };
  errors: {
    googleAddressData?: string;
  };
}
/* 
  address is collected here (auto-complete)
*/
export const FormStepTwo = ({
  formData,
  setFormData,
  errors,
}: FormStepTwoProps) => {
  const handleAddressSelected = (data: GoogleAddressData) => {
    setFormData({ ...formData, googleAddressData: data });
  };

  return (
    <>
      <TextLabel text="Service Address" fontSize="Text-18" color="Gray-100" />
      <AddressInput
        onSelect={handleAddressSelected}
        validationErrors={errors.googleAddressData}
        addressData={formData.googleAddressData as GoogleAddressData}
      />
    </>
  );
};
