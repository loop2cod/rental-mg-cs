import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, DollarSign } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "../ui/button"
import { formatCurrency } from "@/lib/commonFunctions"

interface PaymentSummaryCardProps {
  booking: {
    sub_total: number
    discount: number
    total_amount: number
    amount_paid: number
  }
}

export function PaymentSummaryCard({ booking }: PaymentSummaryCardProps) {
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
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(booking?.sub_total || 0)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Discount</span>
            <span className="font-medium text-destructive">-{formatCurrency(booking?.discount || 0)}</span>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium">Total Amount</span>
              <span className="text-lg font-bold">{formatCurrency(booking?.total_amount || 0)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount Paid</span>
              <span className="font-medium">{formatCurrency(booking?.amount_paid || 0)}</span>
            </div>

            <Progress value={percentagePaid} className="h-2" />

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{percentagePaid.toFixed(0)}% Paid</span>
              <span className="font-medium text-primary">
                Balance: {formatCurrency(booking?.total_amount - booking?.amount_paid || 0)}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-start  rounded-md">
              <div className="flex items-center gap-2 text-sm font-medium">
               <Button>Update Payment</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

