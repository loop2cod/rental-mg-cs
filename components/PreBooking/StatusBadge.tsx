import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      confirmed: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      completed: "bg-blue-100 text-blue-800 border border-blue-200",
      default: "bg-gray-100 text-gray-800 border border-gray-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusMap: Record<string, "default" | "pending" | "confirmed" | "cancelled" | "completed"> = {
    Pending: "pending",
    Confirmed: "confirmed",
    Cancelled: "cancelled",
    Completed: "completed",
  }

  const variant = statusMap[status] || "default"

  return <span className={cn(statusVariants({ variant }), className)}>{status}</span>
}

