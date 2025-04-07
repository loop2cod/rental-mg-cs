import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/commonFunctions"

interface PaymentSummaryCardProps {
  booking: {
    total_amount: number
    amount_paid: number
    discount: number
  }
}

export function OrderPaymentSummaryCard({ booking }: PaymentSummaryCardProps) {
  const percentagePaid = (booking.amount_paid / booking.total_amount) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-medium">{formatCurrency(booking.total_amount)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Discount</span>
            <span className="font-medium text-destructive">-{formatCurrency(booking.discount)}</span>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium">Net Amount</span>
              <span className="text-lg font-bold">
                {formatCurrency(booking.total_amount - booking.discount)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount Paid</span>
              <span className="font-medium">{formatCurrency(booking.amount_paid)}</span>
            </div>

            <Progress value={percentagePaid} className="h-2" />

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{percentagePaid.toFixed(0)}% Paid</span>
              <span className="font-medium text-primary">
                Balance: {formatCurrency(booking.total_amount - booking.amount_paid)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}