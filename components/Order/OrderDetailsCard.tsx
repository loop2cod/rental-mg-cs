import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const OrderDetailsCard = ({ booking }: { booking: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">From Date</p>
          <p className="font-medium">
            {booking?.from_date ? format(new Date(booking?.from_date), "PPP") : 'N/A'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">To Date</p>
          <p className="font-medium">
            {booking?.to_date ? format(new Date(booking?.to_date), "PPP") : 'N/A'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">From Time</p>
          <p className="font-medium">{booking?.from_time}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">To Time</p>
          <p className="font-medium">{booking?.to_time}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Order Date</p>
          <p className="font-medium">
            {booking?.order_date ? format(new Date(booking?.order_date), "PPP") : 'N/A'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Number of Days</p>
          <p className="font-medium">{booking?.no_of_days}</p>
        </div>
      </CardContent>
    </Card>
  )
}