import { prisma } from "@/lib/prisma";
import { getTimeSlotHours } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";

/**
 * Check if a given time range aligns with defined time slots.
 * @param startTime - Start time of the request
 * @param endTime - End time of the request
 * @returns Boolean indicating if the range matches a defined slot
 */
export function isWithinTimeSlot(startTime: Date, endTime: Date): boolean {
  const allTimeSlots = [
    { start: getTimeSlotHours(TimeSlot.Morning)[0], end: getTimeSlotHours(TimeSlot.Morning)[1] },
    { start: getTimeSlotHours(TimeSlot.Daytime)[0], end: getTimeSlotHours(TimeSlot.Daytime)[1] },
    { start: getTimeSlotHours(TimeSlot.Evening)[0], end: getTimeSlotHours(TimeSlot.Evening)[1] },
  ];

  return allTimeSlots.some((slot) => {
    const slotStart = new Date(startTime);
    const slotEnd = new Date(startTime);

    slotStart.setHours(slot.start, 0, 0, 0);
    slotEnd.setHours(slot.end, 0, 0, 0);

    return startTime >= slotStart && endTime <= slotEnd;
  });
}

/**
 * Check if a time slot is available for booking.
 * @param startTime - Start time of the request
 * @param endTime - End time of the request
 * @returns Boolean indicating if the time slot is available
 */
export async function timeSlotIsAvailable(startTime: Date, endTime: Date): Promise<boolean> {
  const overlappingRequests = await prisma.residentRequest.count({
    where: {
      AND: [
        { requestedTimeSlot: { startTime: { lte: endTime } } },
        { requestedTimeSlot: { endTime: { gte: startTime } } },
      ],
    },
  });

  const maxRequestsPerSlot = 3; // Maximum allowed requests per slot
  return overlappingRequests < maxRequestsPerSlot;
}

/**
 * Get all available slots for a given day.
 * @param date - The date to check for available slots
 * @returns List of available time slots
 */
export async function getAvailableSlots(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookedSlots = await prisma.residentRequest.findMany({
    where: {
      requestedTimeSlot: {
        startTime: { gte: startOfDay },
        endTime: { lte: endOfDay },
      },
    },
    select: { requestedTimeSlot: true },
  });

  const bookedRanges = bookedSlots.map((slot) => ({
    startTime: new Date(slot.requestedTimeSlot.startTime),
    endTime: new Date(slot.requestedTimeSlot.endTime),
  }));

  const availableSlots = [TimeSlot.Morning, TimeSlot.Daytime, TimeSlot.Evening].filter(
    (timeSlot) => {
      const [startHour, endHour] = getTimeSlotHours(timeSlot);

      const slotStart = new Date(date);
      const slotEnd = new Date(date);

      slotStart.setHours(startHour, 0, 0, 0);
      slotEnd.setHours(endHour, 0, 0, 0);

      return !bookedRanges.some(
        (booked) =>
          slotStart < booked.endTime && slotEnd > booked.startTime // Overlapping check
      );
    }
  );

  return availableSlots.map((timeSlot) => ({
    label: timeSlot,
    start: getTimeSlotHours(timeSlot)[0],
    end: getTimeSlotHours(timeSlot)[1],
  }));
}