"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export const PaymentSummary = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange 
}: {
  formData: any,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleSelectChange: (name: string, value: string) => void
}) => {
  const bookingItemsTotal = formData.booking_items?.reduce(
    (sum: number, item: any) => sum + Number(item.total_price || 0), 
    0
  ) || 0;

  const outsourcedItemsTotal = formData.outsourced_items?.reduce(
    (sum: number, item: any) => sum + (Number(item.price || 0) * Number(item.quantity || 0) * Number(item.no_of_days || 1)), 
    0
  ) || 0;

  const subtotal = bookingItemsTotal + outsourcedItemsTotal;
  const total = subtotal - (Number(formData.discount) || 0);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Items:</span>
          <span>{formData.total_quantity}</span>
        </div>
        <div className="flex justify-between">
          <span>No. of Days:</span>
          <span>{formData.no_of_days || 'Nil'}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount Amount</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleInputChange}
            min={0}
            max={subtotal}
          />
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total Amount:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method</Label>
          <Select
            value={formData.payment_method}
            onValueChange={(value) => handleSelectChange("payment_method", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount_paid">Amount Paid</Label>
          <Input
            id="amount_paid"
            name="amount_paid"
            type="number"
            value={formData.amount_paid}
            onChange={handleInputChange}
            min={0}
            max={total}
          />
        </div>
        <div className="flex justify-between font-bold">
          <span>Balance:</span>
          <span>₹{(total - formData.amount_paid).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}