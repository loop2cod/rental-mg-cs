import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, CheckCircle, Boxes, BarChart3, Users, CalendarCheck } from "lucide-react";

const Section1 = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Quick Access Menu */}
         <div>
         <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full">
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
                        <span>{label}</span>
                    </Button>
                ))}
            </div>
         </div>

            {/* Notifications Card */}
            <div className="col-span-1 md:col-span-3">
                <Card className="h-full bg-card text-card-foreground shadow-sm">
                        <CardTitle className="text-lg sm:text-xl font-semibold px-4">Notifications</CardTitle>
                    <CardContent>
                        <ScrollArea className="h-[250px] pr-4">
                            <div className="space-y-4">
                                {[
                                    { message: "New booking received", time: "5 minutes ago" },
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
                            <Button variant="outline" className="text-sm sm:text-base">
                                View all notifications
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Section1;