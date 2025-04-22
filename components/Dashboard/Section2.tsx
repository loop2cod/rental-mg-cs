'use client'

import React, { useEffect, useState } from 'react';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '../ui/button';
import { del, get } from '@/utilities/AxiosInterceptor';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import { toast } from '../ui/use-toast';



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

interface ResponseType {
    success: boolean;
    data?: any;
    message?: string;
}

const Section2 = ({
    loading,
    chartData
}:any) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await get<ResponseType>(API_ENDPOINTS.NOTIFICATIONS.GET_ALL, {
                withCredentials: true,
            });
            if (response.success && response.data) {
                setNotifications(response.data);
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to fetch notifications",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Network Error",
                description: error.message || error.response?.data?.message || "Failed to connect to the server",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            setIsLoading(true);
            const response = await del<ResponseType>(`${API_ENDPOINTS.NOTIFICATIONS.DELETE_ONE}/${id}`, {
                withCredentials: true,
            });
            if (response.success) {
                setNotifications(prev => prev.filter(notification => notification.id !== id));
                toast({
                    title: "Success",
                    description: "Notification deleted successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to delete notification",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Network Error",
                description: error.message || error.response?.data?.message || "Failed to connect to the server",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAllNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await del<ResponseType>(API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL, {
                withCredentials: true,
            });
            if (response.success) {
                setNotifications([]);
                toast({
                    title: "Success",
                    description: "All notifications cleared successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to clear notifications",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Network Error",
                description: error.message || error.response?.data?.message || "Failed to connect to the server",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-6">
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
                        <ScrollArea className="xl:h-[325px] pr-4">
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-32">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="border-l-2 border-primary pl-3 py-1 group relative"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm sm:text-base">{notification.message}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(notification.created_At).toLocaleString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDeleteNotification(notification.id)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M3 6h18" />
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground">No notifications</p>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="mt-4 flex justify-center">
                            <Button 
                                variant="outline" 
                                className="text-sm sm:text-base rounded"
                                onClick={handleDeleteAllNotifications}
                                disabled={isLoading || notifications.length === 0}
                            >
                                Clear all notifications
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Section2;