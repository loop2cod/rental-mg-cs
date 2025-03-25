import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DatePickerProps {
  startYear?: number;
  endYear?: number;
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  onOpenChange?: (open: boolean) => void;
  dob?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 10, // Default shows 10 years in future
  date,
  setDate,
  placeholder = "Pick a date",
  onOpenChange,
  dob = false,
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = React.useMemo(() => 
    Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [startYear, endYear]
  );

  const selectedDate = date || new Date();
  const currentYear = getYear(new Date());
  const currentMonth = getMonth(new Date());

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(new Date(selectedDate), months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(new Date(selectedDate), parseInt(year));
    setDate(newDate);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setOpen(false);
    }
  };

  const filteredYears = dob 
    ? years.filter(year => year <= currentYear)
    : years;

  return (
    <Popover 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        onOpenChange?.(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-2">
          <Select
            value={months[getMonth(selectedDate)]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => {
                const isCurrentMonth = months.indexOf(month) === currentMonth;
                const isFutureMonth = dob && 
                  getYear(selectedDate) === currentYear && 
                  months.indexOf(month) > currentMonth;
                
                return (
                  <SelectItem
                    key={month}
                    value={month}
                    disabled={isFutureMonth}
                    className={cn(
                      isCurrentMonth && "font-medium",
                      isFutureMonth && "text-muted-foreground opacity-50"
                    )}
                  >
                    {month}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          <Select
            value={getYear(selectedDate).toString()}
            onValueChange={handleYearChange}
          >
         <SelectTrigger className="w-full">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {filteredYears.map((year) => {
                const isFutureYear = dob && year > currentYear;
                return (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    disabled={isFutureYear}
                    className={cn(
                      year === currentYear && "font-medium",
                      isFutureYear && "text-muted-foreground opacity-50"
                    )}
                  >
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={selectedDate}
          onMonthChange={(month) => setDate(month)}
          disabled={dob ? { after: new Date() } : undefined}
          className="border-0"
        />
      </PopoverContent>
    </Popover>
  );
}