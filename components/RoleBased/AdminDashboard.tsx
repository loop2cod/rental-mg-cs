'use client';

import { AdminSidebar } from "@/components/RoleBased/AdminSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Settings, Users, IndianRupee, Calendar, CheckCircle, Package, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { get } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/commonFunctions"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

type DashboardData = {
  totalRevenue: number
  revenueChange: number
  preBookings: number
  preBookingChange: number
  confirmedBookings: number
  confirmedBookingChange: number
  totalQuantity: number
}

type ChartData = {
  name: string
  preBooking: number
  confirmed: number
}[]

type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [chartData, setChartData] = useState<ChartData>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, chartResponse] = await Promise.all([
        get<ResponseType>(API_ENDPOINTS.DASHBOARD.VALUES, { withCredentials: true }),
        get<ResponseType>(API_ENDPOINTS.DASHBOARD.CHART, { withCredentials: true })
      ])

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data)
      }

      if (chartResponse.success) {
        setChartData(chartResponse.data)
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Dashboard Stats */}
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-24 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Revenue */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData ? formatCurrency(dashboardData.totalRevenue) : '₹0'}
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${getChangeColor(dashboardData?.revenueChange || 0)}`}>
                    {getChangeIcon(dashboardData?.revenueChange || 0)}
                    {dashboardData?.revenueChange ? `${dashboardData.revenueChange > 0 ? '+' : ''}${dashboardData.revenueChange.toFixed(1)}%` : '0%'} from last month
                  </div>
                </CardContent>
              </Card>

              {/* Pre-bookings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pre-bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.preBookings || 0}</div>
                  <div className={`text-xs flex items-center gap-1 ${getChangeColor(dashboardData?.preBookingChange || 0)}`}>
                    {getChangeIcon(dashboardData?.preBookingChange || 0)}
                    {dashboardData?.preBookingChange ? `${dashboardData.preBookingChange > 0 ? '+' : ''}${dashboardData.preBookingChange.toFixed(1)}%` : '0%'} from last month
                  </div>
                </CardContent>
              </Card>

              {/* Confirmed Bookings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.confirmedBookings || 0}</div>
                  <div className={`text-xs flex items-center gap-1 ${getChangeColor(dashboardData?.confirmedBookingChange || 0)}`}>
                    {getChangeIcon(dashboardData?.confirmedBookingChange || 0)}
                    {dashboardData?.confirmedBookingChange ? `${dashboardData.confirmedBookingChange > 0 ? '+' : ''}${dashboardData.confirmedBookingChange.toFixed(1)}%` : '0%'} from last month
                  </div>
                </CardContent>
              </Card>

              {/* Total Inventory */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalQuantity || 0}</div>
                  <p className="text-xs text-muted-foreground">Total quantity available</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chart and Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Bookings Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {loading ? (
                  <div className="h-80 w-full bg-muted rounded animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="preBooking" fill="#8884d8" name="Pre-bookings" />
                      <Bar dataKey="confirmed" fill="#82ca9d" name="Confirmed" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/settings'}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">User Management</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Manage staff users and permissions</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminDashboard;