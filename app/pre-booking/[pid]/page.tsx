'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { withAuth } from "@/components/Middleware/withAuth"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { toast } from "@/components/ui/use-toast"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { get } from "@/utilities/AxiosInterceptor"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { StatusBadge } from "@/components/PreBooking/StatusBadge"
import { CustomerInfoCard } from "@/components/PreBooking/CustomerInfoCard"
import { BookingDetailsCard } from "@/components/PreBooking/BookingDetailsCard"
import { BookingItemsDetailsTable } from "@/components/PreBooking/BookingItemsDetailsTable"
import { OutsourcedItemsDetailsTable } from "@/components/PreBooking/OutsourcedItemsDetailsTable"
import { PaymentSummaryCard } from "@/components/PreBooking/PaymentSummaryCard"

type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

const Page = () => {
  const { pid } = useParams()
  const [loading, setLoading] = useState(true)
  const [preBooking, setPreBooking] = useState<any | null>(null)

  const fetchPreBooking = async () => {
    try {
      const response = await get<ResponseType>(
        `${API_ENDPOINTS.BOOKING.GET_BY_ID}/${pid}`,
        { withCredentials: true }
      )
      if (response.success) {
        setPreBooking(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch Pre-Booking",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch Pre-Booking",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreBooking()
  }, [pid])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!preBooking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No booking found</p>
      </div>
    )
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/list-pre-bookings">Pre-Bookings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>View Pre-Booking</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto">
              <StatusBadge status={preBooking.status} />
            </div>
          </div>
        </header>

        <div className="p-4 space-y-6">
          <CustomerInfoCard customer={preBooking.user} />
          <BookingDetailsCard booking={preBooking} />
          {preBooking.booking_items.length > 0 && (
            <BookingItemsDetailsTable items={preBooking.booking_items} />
          )}
          {preBooking.outsourced_items.length > 0 && (
            <OutsourcedItemsDetailsTable items={preBooking.outsourced_items} />
          )}
          <PaymentSummaryCard 
            booking={preBooking} 
            onPaymentUpdate={fetchPreBooking}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(Page)