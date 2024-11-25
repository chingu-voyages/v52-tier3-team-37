import { InputText } from "@/components/inputText";
import { TextLabel } from "@/components/textLabel";
import { FormSchemaUserFormData } from "../definitions/types";

/* 
  name, e-mail and phone number are collected here
*/
interface FormStepOneProps {
  formData: Partial<FormSchemaUserFormData>;
  setFormData: { (data: Partial<FormSchemaUserFormData>): void };
  errors: {
    email?: string;
    name?: string;
    areaCode?: string;
    phoneNumber?: string;
  };
}
export const FormStepOne = ({
  formData,
  setFormData,
  errors,
}: FormStepOneProps) => {
  return (
    <>
      <TextLabel text="E-mail Address" fontSize="Text-18" color="Gray-100" />
      {/* The e-mail field is auto-populated by the session user */}
      <InputText text="E-mail Address" value={formData.email!} disalbed />

      <TextLabel text="Full Name" fontSize="Text-18" color="Gray-100" />
      <InputText
        text="Full Name"
        value={formData.name!}
        onChange={(event) =>
          setFormData({ ...formData, name: event.target.value })
        }
        error={errors.name}
      />
      <TextLabel text="Phone number" fontSize="Text-18" color="Gray-100" />
      <div className="flex gap-x-2">
        <InputText
          text="Area code"
          value={formData.areaCode}
          maxLength={3}
          type="tel"
          onChange={(event) =>
            setFormData({
              ...formData,
              areaCode: event.target.value,
            })
          }
          error={errors.areaCode}
        />

        <InputText
          text="Phone number"
          value={formData.phoneNumber}
          maxLength={7}
          type="tel"
          onChange={(event) =>
            setFormData({
              ...formData,
              phoneNumber: event.target.value,
            })
          }
          error={errors.phoneNumber}
        />
      </div>
    </>
  );
};
