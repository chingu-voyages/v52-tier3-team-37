import { InputText } from "@/components/inputText";
import { TextLabel } from "@/components/textLabel";
import { FormSchemaUserFormData } from "../definitions/types";

/* 
  name and e-mail are collected here
*/
interface FormStepOneProps {
  formData: Partial<FormSchemaUserFormData>;
  setFormData: { (data: Partial<FormSchemaUserFormData>): void };
  errors: { email?: string; name?: string };
}
export const FormStepOne = ({
  formData,
  setFormData,
  errors,
}: FormStepOneProps) => {
  return (
    <>
      <TextLabel text="E-mail Address" fontSize="Text-18" color="Gray-100" />
      {/* The e-mail field should be pre-populated with oAuth data */}
      <InputText
        text="E-mail Address"
        value={formData.email!}
        disalbed
        onChange={(event) =>
          setFormData({ ...formData, email: event.target.value })
        }
        error={errors.email}
      />

      <TextLabel text="Full Name" fontSize="Text-18" color="Gray-100" />
      <InputText
        text="Full Name"
        value={formData.name!}
        onChange={(event) =>
          setFormData({ ...formData, name: event.target.value })
        }
        error={errors.name}
      />
    </>
  );
};