import {
  addressValidationSchema,
  appointmentValidationSchema,
  nameEmailPhoneValidationSchema,
} from "../../../../lib/validation-schemas/validation-schemas";

/* 
  Since the form is split into steps, we need to validate the form data based on the current step.
  This function returns the appropriate schema for the current step.
*/
export const FormStepValidator = (stepIdx: number) => {
  const rules = [
    {
      validator: nameEmailPhoneValidationSchema,
    },
    {
      validator: addressValidationSchema,
    },
    {
      validator: appointmentValidationSchema,
    },
  ];
  return rules[stepIdx].validator;
};
