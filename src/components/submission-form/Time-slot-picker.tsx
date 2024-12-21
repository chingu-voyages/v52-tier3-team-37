import { getTimeSlotHoursClock } from "@/lib/utils/time-slot/time-slot";
import { RequestedAvailabilityApiResponse } from "@/types/api-responses/requested-timeslot-availability-api-response.ts/requested-availability-api-response";
import { TimeSlot } from "@/types/time-slot";
import { Radio, RadioGroup, RadioProps, cn } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface TimeSlotPickerProps {
  value?: TimeSlot | string;
  onChange?: { (value: TimeSlot): void };
  availabilities: RequestedAvailabilityApiResponse;
}

export const TimeSlotPicker = ({
  value,
  onChange,
  availabilities,
}: TimeSlotPickerProps) => {
  const [selected, setSelected] = useState<TimeSlot | string | null>(
    getAvailableTimeslot(
      availabilities.availabilities!,
      value || TimeSlot.Morning
    )
  );

  const handleTimeSlotChange = (value: string) => {
    setSelected(value);
    onChange?.(value as TimeSlot);
  };

  useEffect(() => {
    const updatedValue = getAvailableTimeslot(
      availabilities.availabilities!,
      value || TimeSlot.Morning
    );
    setSelected(updatedValue);

    onChange?.(updatedValue as TimeSlot);
  }, [availabilities]);

  return (
    <RadioGroup
      orientation="vertical"
      value={selected}
      onValueChange={handleTimeSlotChange}
    >
      <CustomRadio
        value={TimeSlot.Morning}
        isDisabled={!availabilities.availabilities.MOR}
      >
        {getTimeSlotHoursClock(TimeSlot.Morning)}
      </CustomRadio>
      <CustomRadio
        value={TimeSlot.Daytime}
        isDisabled={!availabilities.availabilities.DAY}
      >
        {getTimeSlotHoursClock(TimeSlot.Daytime)}
      </CustomRadio>
      <CustomRadio
        value={TimeSlot.Evening}
        isDisabled={!availabilities.availabilities.EVE}
      >
        {getTimeSlotHoursClock(TimeSlot.Evening)}
      </CustomRadio>
    </RadioGroup>
  );
};

const CustomRadio = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1  items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary bg-simmpy-gray-800 "
        ),
        label: cn("text-simmpy-gray-100"),
      }}
    >
      {children}
    </Radio>
  );
};

const getAvailableTimeslot = (
  availabilities: Record<TimeSlot, boolean>,
  timeSlot?: string
): TimeSlot | null => {
  if (timeSlot && availabilities[timeSlot as TimeSlot]) {
    return timeSlot as TimeSlot;
  }

  // Find the first available time slot for a default condition
  for (const slot in availabilities) {
    if (availabilities[slot as TimeSlot]) {
      return slot as TimeSlot;
    }
  }

  return null;
};
