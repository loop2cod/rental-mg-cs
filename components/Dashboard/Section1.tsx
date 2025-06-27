import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, CheckCircle, Boxes, BarChart3, Users, CalendarCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';

const Section1 = ({
  loading,
  bookings
}: any) => {
  const router = useRouter();

  return (
    <div className="">
      {/* Quick Menu */}
      <div className="col-span-1 md:hidden lg:grid mb-5">
        <div className='border-b-3'>
          <h4 className='font-semibold text-lg'>Quick menu</h4>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 w-full pt-3">
          {[
            { icon: PlusCircle, label: "New Booking", link: "/pre-booking" },
            { icon: CheckCircle, label: "Orders", link: "/list-orders" },
            { icon: CalendarCheck, label: "Pre-Bookings", link: "/list-pre-bookings" },
            { icon: Boxes, label: "Inventory", link: "/list-inventory" },
            { icon: PlusCircle, label: "Add Product", link: "/add-product" },
            { icon: Users, label: "Suppliers", link: "/list-suppliers" },
          ].map(({ icon: Icon, label, link }, index) => (
            <Button
              key={index}
              onClick={() => router.push(link)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto py-3 flex items-center gap-2 text-sm sm:text-base cursor-pointer border rounded"
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className='text-xs md:text-sm lg:text-xs xl:text-base'>{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="col-span-1 md:col-span-4 lg:col-span-3 w-full">
        <Card className="h-full shadow-md rounded-xl border border-muted">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Today&apos;s Bookings & orders</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Latest bookings and their status.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ScrollArea className='h-[220px] lg:h-[400px] xl:h-[220px]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From Date</TableHead>
                    <TableHead>To Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className='text-center'>Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index} className="text-sm">
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[70px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    bookings?.map((booking: any) => (
                      <TableRow key={booking._id} className="text-sm relative">
                        <TableCell className="whitespace-nowrap">
                             {booking.type === "order" && (
                          <div className="absolute top-0 right-0 z-10">
                            <Badge variant="outline" className="text-xs px-1 py-0 h-4 bg-primary/10 text-primary border-primary">
                              ORDER
                            </Badge>
                          </div>
                        )}
                          {new Date(booking.from_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(booking.to_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          <div>
                            <div>{booking.user?.name}</div>
                            <div className="text-xs text-muted-foreground">{booking.user?.mobile}</div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                              <div>
                    <div className="font-medium">Products: {booking.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</div>
                    <div className="text-sm">Outsourced: {booking.outsourced_items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</div>
                </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          ₹{booking.total_amount}
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          ₹{booking.amount_paid || 0}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            booking.status === "Confirmed" || booking.status === "dispatched" || booking.status === "Returned" ? "default" : 
                            booking.status === "Pending" || booking.status === "initiated" || booking.status === "in-return" ? "secondary" : 
                            booking.status === "in-dispatch" ? "outline" :
                            "destructive"
                          }>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (booking.type === "order") {
                                router.push(`/order/details/${booking._id}`);
                              } else {
                                router.push(`/pre-booking//${booking._id}`);
                              }
                            }}
                            className="text-xs"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Section1;