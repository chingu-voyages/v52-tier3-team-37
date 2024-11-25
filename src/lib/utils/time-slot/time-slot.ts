import { TimeSlot } from "@/types/time-slot";

// The objects in this file should be the source of truth for suggested time slot ranges.
export const getTimeSlotSummaryCaption = (timeSlot: TimeSlot) => {
  switch (timeSlot) {
    case TimeSlot.Morning:
      return `Morning between ${getTimeSlotHoursClock(timeSlot)}`;
    case TimeSlot.Daytime:
      return `Daytime between ${getTimeSlotHoursClock(timeSlot)}`;
    case TimeSlot.Evening:
      return `Afternoon between ${getTimeSlotHoursClock(timeSlot)}`;
  }
};

export const getTimeSlotHoursClock = (timeSlot: TimeSlot): string => {
  return `${getTimeSlotHours(timeSlot)[0]}:00 - ${
    getTimeSlotHours(timeSlot)[1]
  }:00`;
};

export const getTimeSlotHours = (timeSlot: TimeSlot) => {
  switch (timeSlot) {
    case TimeSlot.Morning:
      return [8, 11];
    case TimeSlot.Daytime:
      return [11, 14];
    case TimeSlot.Evening:
      return [14, 17];
  }
};
