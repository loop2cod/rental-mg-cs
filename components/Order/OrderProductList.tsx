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
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No products found" : "No products available"}
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <OrderDraggableProduct
                      key={product._id} 
                      product={product} 
                      onAddToBooking={onAddToBooking} 
                    />
                  ))
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}