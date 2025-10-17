import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/commonFunctions"
import { Button } from "../ui/button"
import { useState } from "react"
import { UpdatePaymentDialog } from "../PreBooking/UpdatePaymentDialog"

interface PaymentSummaryCardProps {
  booking: {
    booking_id: string
    total_amount: number
    amount_paid: number
    total_amount_paid: number
    discount: number
    sub_total: number
    user_id: string
  }
    onPaymentUpdate?: () => void
}

export function OrderPaymentSummaryCard({ booking,onPaymentUpdate = () => {} }: PaymentSummaryCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
  const amountPaid = booking.total_amount_paid || booking.amount_paid || 0
  const percentagePaid = booking.total_amount > 0 ? (amountPaid / booking.total_amount) * 100 : 0
  const remainingBalance = booking.total_amount - amountPaid

  return (
    <>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Sub Total</span>
            <span className="font-medium">{formatCurrency(booking.sub_total || 0)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Discount</span>
            <span className="font-medium text-destructive">-{formatCurrency(booking.discount || 0)}</span>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium">Total Amount</span>
              <span className="text-lg font-bold">
                {formatCurrency(booking.total_amount)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount Paid</span>
              <span className="font-medium text-green-600">{formatCurrency(amountPaid)}</span>
            </div>

            <Progress value={percentagePaid} className="h-2" />

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{percentagePaid.toFixed(0)}% Paid</span>
              <span className={`font-medium ${remainingBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                Balance: {formatCurrency(remainingBalance)}
              </span>
            </div>
          </div>
                 <div className="pt-2">
                        <Button onClick={() => setIsDialogOpen(true)}>
                          Update Payment
                        </Button>
                      </div>
        </div>
      </CardContent>
    </Card>
         <UpdatePaymentDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            booking={
              {
                _id: booking?.booking_id,
                total_amount: booking.total_amount,
                amount_paid: amountPaid,
                user_id: booking.user_id,
              }
            }
             stage="order"
            onSuccess={onPaymentUpdate}
          />
          </>
  )
}