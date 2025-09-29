"use client"

import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export const BookingItemsTable = ({ 
  bookingItems, 
  handleItemChange, 
  removeItem 
}: {
  bookingItems: any[],
  handleItemChange: (index: number, field: string, value: any) => void,
  removeItem: (index: number) => void
}) => {
  return (
    <ScrollArea className="h-[300px]">
      <Table className="text-xs md:text-sm lg:text-base
        overflow-x-auto
      ">
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead >Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead >Total</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No items added yet. Search above or drag products here.
              </TableCell>
            </TableRow>
          ) : (
            bookingItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={item.name}
                    disabled
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                    disabled
                    className="text-xs md:text-sm lg:text-base"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                    className="text-xs md:text-sm lg:text-base"
                  />
                </TableCell>
                <TableCell className="font-medium">₹{(item.total_price || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}