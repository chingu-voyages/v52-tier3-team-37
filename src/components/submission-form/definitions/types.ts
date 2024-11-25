import {
  addressValidationSchema,
  appointmentValidationSchema,
  nameEmailPhoneValidationSchema,
} from "@/lib/validation-schemas/validation-schemas";
import { z } from "zod";

export type nameEmailPhoneFormData = z.infer<
  typeof nameEmailPhoneValidationSchema
>;
export type appointmentFormData = z.infer<typeof appointmentValidationSchema>;
export type addressSchemaFormData = z.infer<typeof addressValidationSchema>;

export type FormSchemaUserFormData = nameEmailPhoneFormData &
  appointmentFormData &
  addressSchemaFormData;
