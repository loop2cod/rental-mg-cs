'use client'

import React from 'react';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '../ui/button';

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


const Section2 = () => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-5 lg:grid-cols-6">
            {/* Chart Section */}
            <div className="w-full col-span-3">
                <Card className="shadow-md rounded-xl border border-muted">
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

            <div className='col-span-3'>
                <Card className="h-full bg-card text-card-foreground shadow-sm">
                    <CardTitle className="text-lg sm:text-xl font-semibold px-4">Notifications</CardTitle>
                    <CardContent>
                        <ScrollArea className="h-[325px] pr-4">
                            <div className="space-y-4">
                                {[
                                    { message: "New booking received", time: "5 minutes ago" },
                                    { message: "Inventory updated", time: "15 minutes ago" },
                                    { message: "New supplier added", time: "30 minutes ago" },
                                    { message: "Pre-booking confirmed", time: "1 hour ago" },
                                    { message: "Inventory updated", time: "15 minutes ago" },
                                    { message: "New supplier added", time: "30 minutes ago" },
                                    { message: "Pre-booking confirmed", time: "1 hour ago" },
                                    { message: "Report generated", time: "2 hours ago" },
                                ].map(({ message, time }, index) => (
                                    <div
                                        key={index}
                                        className="border-l-2 border-primary pl-3 py-1"
                                    >
                                        <p className="font-medium text-sm sm:text-base">{message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{time}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="mt-4 flex justify-center">
                            <Button variant="outline" className="text-sm sm:text-base rounded">
                                View all notifications
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Section2;