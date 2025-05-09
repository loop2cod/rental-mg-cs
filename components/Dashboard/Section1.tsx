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
}:any) => {
  const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Quick Menu */}
            <div className="col-span-1 md:hidden lg:grid">
                <div className='mx-4 border-b-3'>
                    <h4 className='font-semibold text-lg'>Quick menu</h4>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 w-full px-3 pt-3">
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
                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto py-3 flex flex-col items-center gap-2 text-sm sm:text-base cursor-pointer border rounded"
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
                        <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Latest bookings and their status.</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <ScrollArea className='h-[220px] lg:h-[400px] xl:h-[220px]'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
  {loading ? (
    Array.from({ length: 10 }).map((_, index) => (
      <TableRow key={index} className="text-sm">
        <TableCell>
          <Skeleton className="h-4 w-[120px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[80px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[60px] ml-auto" />
        </TableCell>
      </TableRow>
    ))
  ) : (
    bookings?.map((booking: any) => (
      <TableRow key={booking.id} className="text-sm">
        <TableCell className="font-medium whitespace-nowrap">
          {booking.user}
        </TableCell>
        <TableCell className="whitespace-nowrap">
          {booking.date}
        </TableCell>
        <TableCell>
          <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"}>
            {booking.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right whitespace-nowrap">
          ₹{booking.amount}
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