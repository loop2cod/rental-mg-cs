"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { put } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { toast } from "@/components/ui/use-toast"

type ResponseType = {
  success: boolean
  message?: string
  data?: any
}

interface UpdatePaymentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  booking: {
    _id: string
    total_amount: number
    amount_paid: number
    user_id: string
  }
  onSuccess: () => void
  stage: string
}

export function UpdatePaymentDialog({
  isOpen,
  onOpenChange,
  booking,
  onSuccess,
  stage,
}: UpdatePaymentDialogProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await put<ResponseType>(
        API_ENDPOINTS.PAYMENT.UPDATE,
        {
          booking_id: booking._id,
          amount_paid: Number(amount),
          total_amount: booking.total_amount,
          payment_method: paymentMethod,
          user_id: booking.user_id,
          stage: stage,
        },
        { withCredentials: true }
      )

      if (response.success) {
        toast({
          title: "Success",
          description: "Payment updated successfully",
        })
        onSuccess()
        setAmount("")
        setPaymentMethod("cash")
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update payment",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update payment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment</DialogTitle>
          <DialogDescription>
            Enter the payment details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min={0}
              max={booking.total_amount - booking.amount_paid}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="net_banking">Net Banking</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 