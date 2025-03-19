import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const times = Array.from({ length: 24 * 4 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
});

export function TimePicker({ value, onChange }:any) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value ? value : "Select Time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <ScrollArea className="h-48">
          <div className="p-2 space-y-1">
            {times.map((time) => (
              <button
                key={time}
                className={cn(
                  "w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs md:text-sm lg:text-base",
                  value === time && "bg-gray-200 dark:bg-gray-700"
                )}
                onClick={() => {
                  onChange(time);
                  setOpen(false);
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
