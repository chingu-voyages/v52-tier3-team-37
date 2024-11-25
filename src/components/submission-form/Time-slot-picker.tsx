import { getTimeSlotHoursClock } from "@/lib/utils/time-slot/time-slot";
import { TimeSlot } from "@/types/time-slot";
import { Radio, RadioGroup, RadioProps, cn } from "@nextui-org/react";
import { useState } from "react";

interface TimeSlotPickerProps {
  value?: TimeSlot | string;
  onChange?: { (value: TimeSlot): void };
}

export const TimeSlotPicker = ({ value, onChange }: TimeSlotPickerProps) => {
  const [selected, setSelected] = useState<TimeSlot | string>(
    value || TimeSlot.Morning
  );

  const handleTimeSlotChange = (value: string) => {
    setSelected(value);
    onChange?.(value as TimeSlot);
  };
  return (
    <RadioGroup
      orientation="vertical"
      value={selected}
      onValueChange={handleTimeSlotChange}
    >
      <CustomRadio value={TimeSlot.Morning}>
        {getTimeSlotHoursClock(TimeSlot.Morning)}
      </CustomRadio>
      <CustomRadio value={TimeSlot.Daytime}>
        {getTimeSlotHoursClock(TimeSlot.Daytime)}
      </CustomRadio>
      <CustomRadio value={TimeSlot.Evening}>
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
