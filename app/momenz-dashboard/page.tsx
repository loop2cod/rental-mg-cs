'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { CheckCircle, Clock, EyeOff, IndianRupee, Package } from "lucide-react"
import Section2 from "@/components/Dashboard/Section2"
import Section1 from "@/components/Dashboard/Section1"
import { useEffect, useState } from "react"
import { withAuth } from "@/components/Middleware/withAuth"
import { get } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { formatCurrency } from "@/lib/commonFunctions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

type DashboardData = {
  totalRevenue: number
  revenueChange: number
  preBookings: number
  preBookingChange: any
  confirmedBookings: number
  confirmedBookingChange: any
  totalQuantity: number
}
type ChartData = {
  name: string
  preBooking: number
  confirmed: number
}[]

type RecentBooking = {
  id: string
  user: string
  date: string
  status: string
  amount: number
}


const Page = () => {
     const [loading1, setLoading1] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [loading3, setLoading3] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[] | null>(null)
  const [isRevenueBlurred, setIsRevenueBlurred] = useState(true)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [pinError, setPinError] = useState(false)

  const fetchDashboardData = async () => {
    try {
      const response = await get<ResponseType>(
        API_ENDPOINTS.DASHBOARD.VALUES,
        { withCredentials: true }
      )
      if (response.success) {
        setDashboardData(response.data)
      }
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading1(false)
    }
  }

  const fetchDashboardChart = async () => {
    try {
      const response = await get<ResponseType>(
        API_ENDPOINTS.DASHBOARD.CHART,
        { withCredentials: true }
      )
      if (response.success) {
        setChartData(response.data)
      }
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading2(false)
    }
  }

  const fetchDashboardBookings = async () => {
    try {
      const response = await get<ResponseType>(
        API_ENDPOINTS.DASHBOARD.RECENT_BOOKINGS,
        { withCredentials: true }
      )
      if (response.success) {
        setRecentBookings(response.data)
      }
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading3(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    fetchDashboardChart()
    fetchDashboardBookings()
  }, [])

  const handlePinSubmit = (pin: string) => {
    if (pin === "2288") {
      setIsRevenueBlurred(false)
      setShowPinDialog(false)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  const handleBlurRevenue = () => {
    setIsRevenueBlurred(true)
  }

  return (
  <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
          <div className="flex-col md:flex">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs md:text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {!isRevenueBlurred && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={handleBlurRevenue}
                          >
                            <EyeOff className="h-4 w-4" />
                          </Button>
                        )}
                        <IndianRupee className="h-4 w-4 text-primary dark:text-secondary-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading1 ? (
                        <div className="flex flex-col items-start">
                          <div className="h-6 w-20 md:h-8 md:w-28 bg-gray-300 animate-pulse rounded"></div>
                          <p className="h-3 w-24 md:w-32 bg-gray-200 animate-pulse rounded mt-1"></p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className={isRevenueBlurred ? "blur-sm" : ""}>
                            <div className="text-base md:text-2xl font-bold">
                              {formatCurrency(dashboardData?.totalRevenue || 0)}
                            </div>
                            <p className="text-[10px] md:text-xs text-muted-foreground">
                              <span className="text-primary dark:text-secondary-foreground">
                                +{dashboardData?.revenueChange || 0}%
                              </span>{" "}
                              from last month
                            </p>
                          </div>
                          {isRevenueBlurred && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    View Revenue
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Enter PIN to View Revenue</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Input
                                        type="password"
                                        placeholder="Enter PIN"
                                        max={4}
                                        className={pinError ? "border-destructive" : ""}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handlePinSubmit(e.currentTarget.value)
                                          }
                                        }}
                                      />
                                      {pinError && (
                                        <p className="text-sm text-destructive">Incorrect PIN. Please try again.</p>
                                      )}
                                  <div>    <Button 
                                        onClick={() => {
                                          const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                                          handlePinSubmit(input?.value || "")
                                        }}
                                      >
                                        Submit
                                      </Button>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs md:text-sm font-medium">
                        Pre-Bookings
                      </CardTitle>
                      <Clock className="h-4 w-4 text-primary dark:text-secondary-foreground" />
                    </CardHeader>
                    <CardContent>
                      {loading1 ? (
                        <div className="flex flex-col items-start">
                          <div className="h-6 w-20 md:h-8 md:w-28 bg-gray-300 animate-pulse rounded"></div>
                          <p className="h-3 w-24 md:w-32 bg-gray-200 animate-pulse rounded mt-1"></p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-base md:text-2xl font-bold">
                            +{dashboardData?.preBookings || 0}
                          </div>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            <span className={dashboardData?.preBookingChange >= 0 ? "text-primary" : "text-destructive"}>
                              {dashboardData?.preBookingChange >= 0 ? '+' : ''}{dashboardData?.preBookingChange || 0}%
                            </span>{" "}
                            from last month
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs md:text-sm font-medium">
                        Confirmed Bookings
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-primary dark:text-secondary-foreground" />
                    </CardHeader>
                    <CardContent>
                      {loading1 ? (
                        <div className="flex flex-col items-start">
                          <div className="h-6 w-20 md:h-8 md:w-28 bg-gray-300 animate-pulse rounded"></div>
                          <p className="h-3 w-24 md:w-32 bg-gray-200 animate-pulse rounded mt-1"></p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-base md:text-2xl font-bold">
                            +{dashboardData?.confirmedBookings || 0}
                          </div>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            <span className={dashboardData?.confirmedBookingChange >= 0 ? "text-primary" : "text-destructive"}>
                              {dashboardData?.confirmedBookingChange >= 0 ? '+' : ''}{dashboardData?.confirmedBookingChange || 0}%
                            </span>{" "}
                            from last month
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs md:text-sm font-medium">
                        Stock Availability
                      </CardTitle>
                      <Package className="h-4 w-4 text-primary dark:text-secondary-foreground" />
                    </CardHeader>
                    <CardContent>
                      {loading1 ? (
                        <div className="flex flex-col items-start">
                          <div className="h-6 w-20 md:h-8 md:w-28 bg-gray-300 animate-pulse rounded"></div>
                          <p className="h-3 w-24 md:w-32 bg-gray-200 animate-pulse rounded mt-1"></p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-base md:text-2xl font-bold">
                            {dashboardData?.totalQuantity || 0}
                          </div>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            Total available items in stock
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <Section1 loading={loading3} bookings={recentBookings} />
          <Section2 loading={loading2} chartData={chartData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(Page)