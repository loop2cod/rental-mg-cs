import * as React from "react"
import { cn } from "@/lib/utils"

interface ClockPickerProps {
  value: string
  onChange: (value: string) => void
  onClose: () => void
}

export function ClockPicker({ value, onChange, onClose }: ClockPickerProps) {
  const [mode, setMode] = React.useState<"hours" | "minutes">("hours")
  const [selectedHour, setSelectedHour] = React.useState(12)
  const [selectedMinute, setSelectedMinute] = React.useState(0)
  const [ampm, setAmPm] = React.useState<"AM" | "PM">("AM")

  React.useEffect(() => {
    if (value) {
      const [time, period] = value.split(" ")
      const [hours, minutes] = time.split(":")
      const hour = parseInt(hours)
      setSelectedHour(hour > 12 ? hour - 12 : hour)
      setSelectedMinute(parseInt(minutes))
      setAmPm(hour >= 12 ? "PM" : "AM")
    }
  }, [value])

  const handleHourClick = (hour: number) => {
    setSelectedHour(hour)
    setMode("minutes")
  }

  const handleMinuteClick = (minute: number) => {
    setSelectedMinute(minute)
    const finalHour = ampm === "PM" && selectedHour !== 12 
      ? selectedHour + 12 
      : ampm === "AM" && selectedHour === 12 
        ? 0 
        : selectedHour
    onChange(`${finalHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${ampm}`)
    onClose()
  }

  const handleAmPmChange = (newAmPm: "AM" | "PM") => {
    setAmPm(newAmPm)
    const finalHour = newAmPm === "PM" && selectedHour !== 12 
      ? selectedHour + 12 
      : newAmPm === "AM" && selectedHour === 12 
        ? 0 
        : selectedHour
    onChange(`${finalHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")} ${newAmPm}`)
  }

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  return (
    <div className="p-2 sm:p-3">
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <button
          onClick={() => setMode("hours")}
          className={cn(
            "px-2 py-1 rounded-md text-xs sm:text-sm font-medium",
            mode === "hours" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          Hour
        </button>
        <button
          onClick={() => setMode("minutes")}
          className={cn(
            "px-2 py-1 rounded-md text-xs sm:text-sm font-medium",
            mode === "minutes" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          Minute
        </button>
      </div>

      <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-2 sm:mb-3">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        {mode === "hours" ? (
          <div className="absolute inset-0">
            {hours.map((hour) => (
              <button
                key={hour}
                onClick={() => handleHourClick(hour)}
                className={cn(
                  "absolute w-6 h-6 sm:w-7 sm:h-7 -ml-3 sm:-ml-3.5 -mt-3 sm:-mt-3.5 rounded-full flex items-center justify-center text-xs sm:text-sm",
                  selectedHour === hour
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
                style={{
                  left: `calc(50% + ${Math.cos((hour * 30 - 90) * (Math.PI / 180)) * (mode === "hours" ? 62 : 70)}px)`,
                  top: `calc(50% + ${Math.sin((hour * 30 - 90) * (Math.PI / 180)) * (mode === "hours" ? 62 : 70)}px)`,
                }}
              >
                {hour}
              </button>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0">
            {minutes.map((minute) => (
              <button
                key={minute}
                onClick={() => handleMinuteClick(minute)}
                className={cn(
                  "absolute w-6 h-6 sm:w-7 sm:h-7 -ml-3 sm:-ml-3.5 -mt-3 sm:-mt-3.5 rounded-full flex items-center justify-center text-xs sm:text-sm",
                  selectedMinute === minute
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
                style={{
                  left: `calc(50% + ${Math.cos((minute * 6 - 90) * (Math.PI / 180)) * (mode === "minutes" ? 62 : 70)}px)`,
                  top: `calc(50% + ${Math.sin((minute * 6 - 90) * (Math.PI / 180)) * (mode === "minutes" ? 62 : 70)}px)`,
                }}
              >
                {minute.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        )}
        <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 -ml-0.5 bg-primary transform -translate-y-1/2 origin-bottom" />
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-md border border-border p-0.5">
          <button
            onClick={() => handleAmPmChange("AM")}
            className={cn(
              "px-3 py-1.5 rounded-sm text-xs sm:text-sm font-medium transition-colors",
              ampm === "AM" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent"
            )}
          >
            AM
          </button>
          <button
            onClick={() => handleAmPmChange("PM")}
            className={cn(
              "px-3 py-1.5 rounded-sm text-xs sm:text-sm font-medium transition-colors",
              ampm === "PM" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent"
            )}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  )
} 