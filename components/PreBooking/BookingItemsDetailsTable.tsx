import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BookingItem {
  _id: string
  product_id: string
  name: string
  price: number
  quantity: number
  total_price: number
  reserved_quantity: number
  available_quantity: number
}

interface BookingItemsDetailsTableProps {
  items: BookingItem[]
}

export function BookingItemsDetailsTable({ items }: BookingItemsDetailsTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Booked Items</CardTitle>
          </div>
          <Badge variant="outline" className="ml-auto">
            {items.length} {items.length === 1 ? "item" : "items"}
          </Badge>
        </div>
        <CardDescription>Items reserved for this booking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="font-normal">
                      {item.reserved_quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-normal">
                      {item.available_quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">₹{item.total_price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

