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
          <span>Total Amount:</span>
          <span>₹{formData.total_amount.toFixed(2)}</span>
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
          />
        </div>
        <div className="flex justify-between font-bold">
          <span>Balance:</span>
          <span>₹{(formData.total_amount - formData.amount_paid).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}