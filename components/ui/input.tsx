import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, onChange, ...props }: React.ComponentProps<"input">) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number" || type === "tel") {
      let value = e.target.value
      
      // Remove leading zeros unless it's a decimal number starting with 0
      if (/^0[0-9]+$/.test(value)) {
        value = value.replace(/^0+/, '')
        if (value === '') value = '0' // Prevent empty value if user deletes everything
        e.target.value = value
      }
      
      // Call the original onChange if provided
      if (onChange) {
        onChange(e)
      }
    } else if (onChange) {
      onChange(e)
    }
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md  bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      onChange={handleChange}
      {...props}
    />
  )
}

export { Input }