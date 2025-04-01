// components/view-pre-booking/BookingDetailsCard.tsx
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const BookingDetailsCard = ({ booking }: { booking: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">From Date</p>
          <p className="font-medium">
            {format(new Date(booking.from_date), "PPP")}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">To Date</p>
          <p className="font-medium">
            {format(new Date(booking.to_date), "PPP")}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">From Time</p>
          <p className="font-medium">{booking.from_time}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">To Time</p>
          <p className="font-medium">{booking.to_time}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Booking Date</p>
          <p className="font-medium">
            {format(new Date(booking.booking_date), "PPP")}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Number of Days</p>
          <p className="font-medium">{booking.no_of_days}</p>
        </div>
      </CardContent>
    </Card>
  )
}