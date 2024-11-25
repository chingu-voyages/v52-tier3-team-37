import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";

export function assignRequestedTimeSlot(
  appointmentDate: string,
  timeSlot: TimeSlot
): { startTime: Date; endTime: Date } {
  // Requested timeslots are blocks

  switch (timeSlot) {
    case TimeSlot.Morning:
      return {
        startTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Morning)[0])
          .set("minute", 0)
          .set("second", 0)
          .toDate(),
        endTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Morning)[1])
          .set("minute", 0)
          .set("second", 0)
          .toDate(),
      };
    case TimeSlot.Daytime:
      return {
        startTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Daytime)[0])
          .set("minute", 0)
          .set("second", 0)
          .toDate(),
        endTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Daytime)[1])
          .set("minute", 0)
          .set("second", 0)
          .toDate(),
      };
    case TimeSlot.Evening:
      return {
        startTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Evening)[0])
          .set("minute", 0)
          .set("second", 0)
          .toDate(),
        endTime: dayjs(appointmentDate)
          .set("hour", getTimeSlotHours(TimeSlot.Evening)[1])
          .set("minute", 0)
          .set("second", 0)
          .toDate(),
      };
  }
}
