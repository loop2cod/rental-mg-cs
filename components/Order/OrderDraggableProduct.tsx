"use client"

import { useDrag } from "react-dnd"
import { GripHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    <Card
      ref={drag as any}
      className={`p-2 hover:shadow-md transition-all cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Image */}
      <div className="relative w-full mb-1 rounded overflow-hidden bg-gray-50 aspect-[5/7]">
        <img
          src={product?.images[0] || "/placeHolder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0.5 right-0.5">
          <GripHorizontal className="h-3 w-3 text-white bg-black/50 rounded-bl p-0.5" />
        </div>
        {product?.code && (
          <Badge 
            variant="secondary" 
            className="absolute top-0.5 left-0.5 text-[10px] font-mono px-1 py-0"
          >
            {product.code}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="font-medium text-xs leading-tight truncate" title={product?.name}>
          {product?.name}
        </h3>
        
        <p className="text-[10px] text-gray-500 truncate">
          {product?.category_name || "Uncategorized"}
        </p>

        {/* Availability */}
        <p className="text-[10px] text-gray-500">
          Available: {product?.available_quantity || 0}
        </p>

        {/* Price */}
        <div className="flex justify-between items-center text-[10px]">
          <span className="font-semibold">₹{product?.unit_cost}</span>
          <span className="text-gray-500">/day</span>
        </div>

        {/* Add Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full h-6 text-[10px] px-1"
          onClick={() => onAddToBooking(product)}
        >
          <Plus className="h-2.5 w-2.5 mr-0.5" />
          Add
        </Button>
      </div>
    </Card>
  )
}

export default OrderDraggableProduct