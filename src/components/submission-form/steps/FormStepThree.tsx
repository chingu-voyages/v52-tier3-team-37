import { TextLabel } from "@/components/textLabel";
import { RequestedAvailabilityApiResponse } from "@/types/api-responses/requested-timeslot-availability-api-response.ts/requested-availability-api-response";
import { TimeSlot } from "@/types/time-slot";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "@nextui-org/calendar";
import { cn } from "@nextui-org/theme";
import { ResidentRequestService } from "app/services/resident-request-service";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfoIcon from "../../../../public/assets/images/icons/info-circle.svg";
import { TimeSlotPicker } from "../Time-slot-picker";
import { FormSchemaUserFormData } from "../definitions/types";

/*
 This will capture date and appointment time-slot
*/
interface FormStepThreeProps {
  formData: Partial<FormSchemaUserFormData>;
  setFormData: { (data: Partial<FormSchemaUserFormData>): void };
  errors: { appointmentDate?: string; timeSlot?: string };
}
export const FormStepThree = ({
  formData,
  setFormData,
  errors,
}: FormStepThreeProps) => {
  const [appointmentDate, setAppointmentDate] = useState(
    toCalendarDateFromJSDate(formData.appointmentDate!)
  );
  const [slotAvailabilities, setSlotAvailabilities] =
    useState<null | RequestedAvailabilityApiResponse>(null);

  const handleAppointmentDateChange = async (date: CalendarDate) => {
    // Attempt to fetch the available time slots for the selected date
    const slotsAvailability =
      await ResidentRequestService.getAvailableTimeSlotsByDate(
        date.toDate(getLocalTimeZone())
      );

    setSlotAvailabilities(slotsAvailability);

    setAppointmentDate(date);
    setFormData({
      ...formData,
      appointmentDate: date.toDate(getLocalTimeZone()),
    });
  };

  const handleTimeSlotChange = (value: TimeSlot) => {
    setFormData({
      ...formData,
      timeSlot: value,
    });
  };

  useEffect(() => {
    // Get the initial slot availabilities for the default date
    const getInitialSlotAvailabilities = async () => {
      try {
        const fetchedAvailabilities =
          await ResidentRequestService.getAvailableTimeSlotsByDate(
            formData.appointmentDate!
          );
        setSlotAvailabilities(fetchedAvailabilities);
      } catch (error) {
        console.error("Failed to get initial slot availabilities", error);
      }
    };
    getInitialSlotAvailabilities();
  }, []);
  return (
    <>
      <TextLabel
        text="Select a date and time for your appointment"
        fontSize="Text-18"
        color="Gray-100"
      />
      <div className="flex justify-evenly flex-wrap">
        {/* Calendar needs to go here */}
        <div>
          <Calendar
            aria-label="Select appointment date"
            value={appointmentDate}
            minValue={today(getLocalTimeZone()).add({ days: 1 })}
            onChange={handleAppointmentDateChange}
            classNames={{
              base: cn("bg-simmpy-gray-800"),
              headerWrapper: cn("bg-simmpy-gray-800"),
              gridHeaderRow: cn("bg-simmpy-gray-800"),
              cellButton: cn(
                "data-[selected]:bg-simmpy-green",
                "data-[disabled]:text-simmpy-gray-900",
                "text-white"
              ),
            }}
          />
        </div>
        {slotAvailabilities && (
          <div>
            <TimeSlotPicker
              value={formData.timeSlot}
              onChange={handleTimeSlotChange}
              availabilities={slotAvailabilities}
            />
          </div>
        )}
      </div>
      <div>
        {errors.appointmentDate && (
          <p className="text-red-500">Select an available appointment date.</p>
        )}
        {errors.timeSlot && (
          <p className="text-red-500">Select an available time slot</p>
        )}
      </div>
      <div className="flex">
        <Image alt="info" src={InfoIcon} width={16} />
        <p className="text-white">
          Note that your appointment date and time slot are not guaranteed. We
          will e-mail you with a confirmed appointment details.
        </p>
      </div>
    </>
  );
};

const toCalendarDateFromJSDate = (date: Date): CalendarDate => {
  // formData.appointmentDate is a Date object but the NextUi calendar component requires a CalendarDate object
  const convertedDayjsDate = dayjs(date);

  return new CalendarDate(
    convertedDayjsDate.get("year"),
    convertedDayjsDate.get("month") + 1, // Month is 0-indexed
    convertedDayjsDate.get("date")
  );
};
