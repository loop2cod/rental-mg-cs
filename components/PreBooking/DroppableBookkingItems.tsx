"use client"

import { useDrop } from "react-dnd"
import { Badge } from "@/components/ui/badge"

const DroppableBookingItems = ({ onDrop, children }: any) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "product",
    drop: () => ({ name: "BookingItems" }),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div ref={drop as any} className={`rounded-md border ${isOver ? "border-primary bg-primary/5" : ""}`}>
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg z-10 pointer-events-none">
          <Badge variant="outline" className="bg-background">
            Drop to add item
          </Badge>
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  )
}

export default DroppableBookingItems