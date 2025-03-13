import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, CheckCircle, Boxes, BarChart3, Users, CalendarCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '../ui/scroll-area';

const Section1 = () => {
    const recentBookings = [
        { id: 1, user: "John Doe", date: "2023-10-01", status: "Confirmed", amount: 120 },
        { id: 2, user: "Jane Smith", date: "2023-10-02", status: "Pending", amount: 80 },
        { id: 3, user: "Alice Johnson", date: "2023-10-03", status: "Confirmed", amount: 150 },
        { id: 4, user: "Bob Brown", date: "2023-10-04", status: "Pending", amount: 90 },
        { id: 5, user: "Alice Johnson", date: "2023-10-03", status: "Confirmed", amount: 150 },
        { id: 6, user: "John Doe", date: "2023-10-01", status: "Confirmed", amount: 120 },
        { id: 7, user: "Jane Smith", date: "2023-10-02", status: "Pending", amount: 80 },
        { id: 8, user: "Alice Johnson", date: "2023-10-03", status: "Confirmed", amount: 150 },
        { id: 9, user: "Bob Brown", date: "2023-10-04", status: "Pending", amount: 90 },
        { id: 10, user: "Alice Johnson", date: "2023-10-03", status: "Confirmed", amount: 150 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Quick Menu */}
            <div className="col-span-1 md:hidden lg:grid">
                <div className='mx-4 border-b-3'>
                    <h4 className='font-semibold text-lg'>Quick menu</h4>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 w-full px-3 pt-3">
                    {[
                        { icon: PlusCircle, label: "New Booking" },
                        { icon: CheckCircle, label: "Orders" },
                        { icon: CalendarCheck, label: "Pre-Bookings" },
                        { icon: Boxes, label: "Inventory" },
                        { icon: BarChart3, label: "Reports" },
                        { icon: Users, label: "Suppliers" },
                    ].map(({ icon: Icon, label }, index) => (
                        <Button
                            key={index}
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
                                    {recentBookings.map((booking) => (
                                        <TableRow key={booking.id} className="text-sm">
                                            <TableCell className="font-medium whitespace-nowrap">{booking.user}</TableCell>
                                            <TableCell className="whitespace-nowrap">{booking.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"}>
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">₹{booking.amount}</TableCell>
                                        </TableRow>
                                    ))}
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