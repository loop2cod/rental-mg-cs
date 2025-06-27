'use client'
import * as React from "react";

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TimePicker({ value, onChange, placeholder = "HH:MM", className = "" }: TimePickerProps) {
  const [inputValue, setInputValue] = React.useState(value || "");

  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const formatTimeInput = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "");
    
    if (digits.length === 0) return "";
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
      // Auto-add colon after 2 digits
      return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }
    
    // Limit to 4 digits (HHMM)
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  const validateTime = (time: string) => {
    if (!time.includes(":")) return false;
    
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const m = parseInt(minutes);
    
    return h >= 0 && h <= 23 && m >= 0 && m <= 59;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatTimeInput(rawValue);
    
    setInputValue(formattedValue);
    
    // Only call onChange if we have a valid complete time (HH:MM)
    if (formattedValue.length === 5 && validateTime(formattedValue)) {
      onChange(formattedValue);
    } else if (formattedValue === "") {
      onChange("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    // Validate on blur and clear if invalid
    if (inputValue && !validateTime(inputValue)) {
      setInputValue("");
      onChange("");
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={5}
      className={`w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
}


//timePickerComponent