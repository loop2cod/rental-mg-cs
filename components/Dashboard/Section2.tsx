'use client'

import React from 'react';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const chartData = [
    { name: "Jan", preBooking: 30, confirmed: 20 },
    { name: "Feb", preBooking: 50, confirmed: 40 },
    { name: "Mar", preBooking: 40, confirmed: 35 },
    { name: "Apr", preBooking: 60, confirmed: 50 },
    { name: "May", preBooking: 70, confirmed: 60 },
    { name: "Jun", preBooking: 30, confirmed: 20 },
    { name: "Jul", preBooking: 50, confirmed: 40 },
    { name: "Aug", preBooking: 40, confirmed: 35 },
    { name: "Sep", preBooking: 60, confirmed: 50 },
    { name: "Oct", preBooking: 70, confirmed: 60 },
    { name: "Nov", preBooking: 60, confirmed: 50 },
    { name: "Dec", preBooking: 70, confirmed: 60 },
];

const chartConfig = {
    preBooking: {
      label: "PreBooking",
      color: "var(--chart-1)",
    },
    confirmed: {
      label: "Confirmed",
      color: "var(--chart-2)",
    },
} satisfies ChartConfig;

const recentBookings = [
    { id: 1, user: "John Doe", date: "2023-10-01", status: "Confirmed", amount: 120 },
    { id: 2, user: "Jane Smith", date: "2023-10-02", status: "Pending", amount: 80 },
    { id: 3, user: "Alice Johnson", date: "2023-10-03", status: "Confirmed", amount: 150 },
    { id: 4, user: "Bob Brown", date: "2023-10-04", status: "Pending", amount: 90 },
    { id: 5, user: "Alice Johnson", date: "2023-10-03", status: "Confirmed", amount: 150 },
 
];

const Section2 = () => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {/* Chart Section */}
            <div className="lg:col-span-2 sm:col-span-2 col-span-1 w-full">
                <Card className="h-full shadow-md rounded-xl border border-muted">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Rental Activity</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Track pre-bookings and confirmed bookings trends.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                                <BarChart data={chartData}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={8} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                                    <Bar dataKey="preBooking" fill="var(--color-preBooking)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="confirmed" fill="var(--color-confirmed)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            
            {/* Recent bookings */}
            <div className="lg:col-span-4 sm:col-span-2 col-span-1 w-full">
                <Card className="h-full shadow-md rounded-xl border border-muted">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Latest bookings and their status.</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Section2;