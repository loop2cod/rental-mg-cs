"use client"

import { useDrag } from "react-dnd"
import { GripHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const OrderDraggableProduct = ({ product, onAddToBooking }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "product",
    item: { product },
    end: (item: any, monitor: any) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        onAddToBooking(item.product)
      }
    },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag as any}
      className={`flex items-center justify-between p-2 hover:bg-muted transition-all rounded-lg cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="h-14 w-14 relative rounded-md overflow-hidden">
          <img src={product?.images[0] || "/placeHolder.jpg"} alt={product.name} className="object-cover" />
          <div className="absolute top-0 right-0">
            <GripHorizontal className="h-4 w-4 text-white bg-black/50 rounded-bl" />
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">{product?.name}</h3>
          <div className="flex items-center gap-2">
            {product?.code && (
              <span className="text-xs font-mono bg-secondary px-1 py-0.5 rounded">#{product.code}</span>
            )}
            <p className="text-xs text-muted-foreground">{product?.category_name || "Table"}</p>
          </div>
          <p className="text-xs text-muted-foreground">Availablity: {product?.available_quantity}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="text-sm font-semibold">₹{product?.unit_cost} <span className="text-muted-foreground text-xs">/ day</span></p>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onAddToBooking(product)}>
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>
    </div>
  )
}

export default OrderDraggableProduct