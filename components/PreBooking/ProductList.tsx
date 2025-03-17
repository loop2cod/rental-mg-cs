// ProductList.tsx
"use client"

import DraggableProduct from "./CreatePreBooking" // Import the DraggableProduct component
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "../ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface Product {
  _id: string
  name: string
  image: string
  unit_cost: number
  quantity: number
}

interface ProductListProps {
  products: Product[]
  loading: boolean
  onAddToBooking: (product: Product) => void
}

export const ProductList = ({ products, loading, onAddToBooking }: ProductListProps) => {
  return (
    <Card className="py-4 border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl md:text-2xl font-semibold px-2">Products</CardTitle>
        <CardDescription className="px-2">Drag products to add to booking</CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <ScrollArea className="h-[calc(100vh-200px)] rounded-lg shadow-sm overflow-y-auto">
          <div className="space-y-2 p-2">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-md" />
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))
            ) : (
              <>
                {products.map((product) => (
                  <DraggableProduct key={product._id} product={product} onAddToBooking={onAddToBooking} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}