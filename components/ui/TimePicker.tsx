'use client'
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ClockPicker } from "./ClockPicker";

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formatTime = (time: string) => {
    if (!time) return "Select Time";
    
    // Handle 24-hour format input
    if (time.includes(":")) {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      
      // Convert to 12-hour format
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
    }
    
    return time;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {formatTime(value || "")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <ClockPicker
          value={value || "12:00 AM"}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}


//timePickerComponent