"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "../ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import OrderDraggableProduct from "./OrderDraggableProduct"

interface Product {
  _id: string
  name: string
  code?: string
  image: string
  unit_cost: number
  quantity: number
}

interface ProductListProps {
  products: Product[]
  loading: boolean
  onAddToBooking: (product: Product) => void
}

export const OrderProductList = ({ products, loading, onAddToBooking }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  return (
    <Card className="py-4 border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl md:text-2xl font-semibold px-2">Products</CardTitle>
        <CardDescription className="px-2">Drag products to add to booking</CardDescription>
        <div className="relative px-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <ScrollArea className="h-[calc(100vh-250px)] rounded-lg shadow-sm overflow-y-auto">
          <div className="p-2">
            {loading ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="p-2 border rounded-lg">
                    <Skeleton className="w-full aspect-[5/7] rounded mb-1" />
                    <Skeleton className="h-3 w-3/4 mb-1" />
                    <Skeleton className="h-2 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No products found" : "No products available"}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredProducts.map((product) => (
                      <OrderDraggableProduct
                        key={product._id} 
                        product={product} 
                        onAddToBooking={onAddToBooking} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}