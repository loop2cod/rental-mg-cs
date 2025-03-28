'use client'
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { WheelPicker } from "./WheelPicker";

const hourItems = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: (index + 1).toString().padStart(2, "0")
}));

const minuteItems = Array.from({ length: 12 }, (_, index) => ({
  value: (index * 5).toString().padStart(2, "0"),
  label: (index * 5).toString().padStart(2, "0")
}));

const ampmItems = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" }
];

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
}

function parseTimeValue(value?: string) {
  const defaultValue = { hour: "06", minute: "30", ampm: "AM" };
  if (!value) return defaultValue;
  
  const [timePart, ampm] = value.split(" ");
  const [hour, minute] = timePart.split(":");
  return {
    hour: hour?.padStart(2, "0") || "06",
    minute: minute?.padStart(2, "0") || "30",
    ampm: ampm || "AM"
  };
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [draftTime, setDraftTime] = React.useState(() => parseTimeValue(value));
  const [originalTime, setOriginalTime] = React.useState(draftTime);

  React.useEffect(() => {
    if (open) {
      const parsed = parseTimeValue(value);
      setOriginalTime(parsed);
      setDraftTime(parsed);
    }
  }, [open, value]);

  const handleTimeChange = (type: string, val: string | number) => {
    setDraftTime(prev => ({
      ...prev,
      [type]: val.toString().padStart(2, "0")
    }));
  };

  const handleCancel = () => {
    setDraftTime(originalTime);
    setOpen(false);
  };

  const handleConfirm = () => {
    onChange(`${draftTime.hour}:${draftTime.minute} ${draftTime.ampm}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value || "Select Time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-1">
          <WheelPicker
            hourItems={hourItems}
            hourValue={draftTime.hour}
            onHourChange={(val) => handleTimeChange("hour", val)}
            minuteItems={minuteItems}
            minuteValue={draftTime.minute}
            onMinuteChange={(val) => handleTimeChange("minute", val)}
            ampmItems={ampmItems}
            ampmValue={draftTime.ampm}
            onAmpmChange={(val) => handleTimeChange("ampm", val)}
            onCancel={handleCancel}
            onSelect={handleConfirm}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}


//timePickerComponent