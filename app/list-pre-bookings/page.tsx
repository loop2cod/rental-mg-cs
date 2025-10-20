'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { withAuth } from "@/components/Middleware/withAuth"
import ListPreBookings from "@/components/PreBooking/ListPreBookings"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { toast } from "@/components/ui/use-toast"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { get } from "@/utilities/AxiosInterceptor"
import { useEffect, useState } from "react"


interface ResponseType {
  success: boolean;
  data?: any;
  message?: string;
}

const Page = () => {
    const [preBookings, setPreBookings] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch pre-bookings
    const fetchPreBookings = async (page: number = 1, limit: number = 10, search: string = "") => {
        setIsLoading(true);
        try {
            const response = await get<ResponseType>(API_ENDPOINTS.BOOKING.GET_ALL, {
                params: { page, limit, search, status: "Pending" },
                withCredentials: true,
            });
            if (response.success) {
                console.log('Pre-bookings API response:', response.data);
                console.log('Bookings received:', response.data.bookings);
                response.data.bookings?.forEach((booking: any, index: number) => {
                    console.log(`Booking ${index + 1}:`, {
                        id: booking._id,
                        booking_id: booking.booking_id,
                        status: booking.status,
                        isDeleted: booking.isDeleted,
                        user_name: booking.user_id?.name
                    });
                });
                setPreBookings(response.data.bookings);
                setTotalPages(response.data?.pagination?.totalPages);
                setTotalCount(response.data?.pagination?.totalItems);
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to fetch Pre-Bookings",
                    variant: "destructive",
                });
            }
            } catch (error: any) {
              console.log(error)
                toast({
                    title: "Error",
                    description: error.response?.data?.message || error.message || "Failed to fetch Pre-Bookings",
                    variant: "destructive",
                });
            }finally{
                setIsLoading(false);
            }
        }

        useEffect(() => {
            fetchPreBookings(currentPage, itemsPerPage, searchTerm);
        }, [currentPage, itemsPerPage, searchTerm]);

        // Handle search input change
        const handleSearch = (term: string) => {
            setSearchTerm(term);
            setCurrentPage(1);
        };

        const handlePageChange = (page: number) => {
          setCurrentPage(page)
        }
      
        const handlePageSizeChange = (size: number) => {
          setItemsPerPage(size)
          setCurrentPage(1) // Reset to first page when changing page size
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
                  <BreadcrumbLink href="/momenz-dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>View Pre-Bookings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
    <div>
<ListPreBookings
        preBookings={preBookings}
        fetchPreBookings={fetchPreBookings}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        />
    </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(Page)