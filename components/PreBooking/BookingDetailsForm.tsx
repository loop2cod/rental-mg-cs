"use client"

import { Label } from "@/components/ui/label"
import { DatePicker } from "../ui/date-picker"
import {TimePicker } from "../ui/TimePicker"

export const BookingDetailsForm = ({ 
  formData, 
  fromDate, 
  setFromDate, 
  toDate, 
  setToDate, 
  bookingDate, 
  setBookingDate,
  setFormData 
}: {
  formData: any,
  fromDate: Date | undefined,
  setFromDate: (date: Date | undefined) => void,
  toDate: Date | undefined,
  setToDate: (date: Date | undefined) => void,
  bookingDate: Date | undefined,
  setBookingDate: (date: Date | undefined) => void,
  setFormData: React.Dispatch<React.SetStateAction<any>>
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Booking Details</h3>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className="mb-4 space-y-2">
          <Label>Booking Date</Label>
          <DatePicker setDate={setBookingDate} date={bookingDate} />
        </div>
      </div> */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="space-y-2">
          <Label>From Date</Label>
          <DatePicker setDate={setFromDate} date={fromDate} />
        </div>
        <div className="space-y-2">
          <Label>To Date</Label>
          <DatePicker setDate={setToDate} date={toDate} />
        </div>
        <div className="space-y-2">
          <Label>From Time</Label>
          <TimePicker
            value={formData.from_time}
            onChange={(value: any) => setFormData((prev: any) => ({ ...prev, from_time: value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>To Time</Label>
          <TimePicker
            value={formData.to_time}
            onChange={(value: any) => setFormData((prev: any) => ({ ...prev, to_time: value }))}
          />
        </div>
      </div>
    </div>
  )
}