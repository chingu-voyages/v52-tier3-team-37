import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import { z } from "zod";

// Name, e-mail, phone number/area code are validated here
export const nameEmailPhoneSchema = z.object({
  areaCode: z.custom(
    (value: string) => {
      const areaCodeRegex = /^[2-9]\d{2}$/;
      return areaCodeRegex.test(value);
    },
    { message: "Enter a valid 3-digit area code" }
  ),
  phoneNumber: z.custom(
    (value: string) => {
      const phoneNumberRegEx = /^\d{7}$/;
      return phoneNumberRegEx.test(value);
    },
    { message: "Enter a valid 7-digit phone number" }
  ),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .transform((name) => name.toLowerCase()),
  email: z.string().email({ message: "Invalid email address" }),
});

export const addressSchema = z.object({
  googleAddressData: z.object(
    {
      description: z.string().min(1, { message: "Address is required" }),
      place_id: z.string().min(1, { message: "Place ID is required" }),
      address: z.object({
        streetName: z.string().min(1, { message: "Street name is required" }),
        streetNumber: z
          .string()
          .min(1, { message: "Street number is required" }),
        city: z.string().min(11, { message: "City is required" }),
        zipCode: z.string().min(5, { message: "Zip code is required" }),
        latitude: z.number(),
        longitude: z.number(),
      }),
    },
    { message: "Address is required" }
  ),
});

export const appointmentSchema = z.object({
  appointmentDate: z
    .date()
    .min(dayjs().set("hour", 0).set("minute", 0).set("second", 0).toDate()),

  timeSlot: z.nativeEnum(TimeSlot),
});