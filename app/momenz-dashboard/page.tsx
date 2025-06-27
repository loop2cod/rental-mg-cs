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
import { del, get } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { formatCurrency } from "@/lib/commonFunctions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InventoryTable } from "@/components/Inventory/InventoryTable"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"


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
    const router = useRouter()
     const [loading1, setLoading1] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [loading3, setLoading3] = useState(true)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
   const [inventory, setInventory] = useState<any>([])

  const fetchInventory = async (page: number = 1, limit: number = 10, search: string = "") => {
    setIsLoading(true);
    try {
      const response = await get<ResponseType>(API_ENDPOINTS.INVENTORY.GET_ALL, {
        params: { page, limit, search },
        withCredentials: true,
      });
      if (response.success) {
        setInventory(response.data.products);
        setTotalPages(response.data?.pagination?.totalPages);
        setTotalCount(response.data?.pagination?.totalItems);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch Inventory",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch Inventory",
        variant: "destructive",
      });
    }finally{
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchInventory(currentPage, itemsPerPage, searchTerm);
  }, [currentPage, itemsPerPage, searchTerm]);

  // Handle search input change
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (id: string): Promise<void> => {
    try{
      const response = await del<ResponseType>(`${API_ENDPOINTS.INVENTORY.DELETE}/${id}`, {
        withCredentials: true,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Product deleted successfully",
        });
        // Refresh the inventory data after successful deletion
        await fetchInventory(currentPage, itemsPerPage, searchTerm);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to delete product",
        variant: "destructive",
      });
      throw error; // Re-throw to be caught by the component
    }
  }

  const openEditDialog = (item: any) => {
    router.push(`/list-inventory/details/${item?._id}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size)
    setCurrentPage(1) // Reset to first page when changing page size
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
    fetchDashboardBookings()
  }, [])

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
          <Section1 loading={loading3} bookings={recentBookings} />
             <div className="bg-card py-6 rounded-lg shadow-md border border-border">
               <InventoryTable
                      onSearch={handleSearch}
                      isLoading={isLoading}
                      inventory={inventory}
                      onEdit={openEditDialog}
                      onDelete={handleDeleteProduct}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalCount={totalCount}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
             </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(Page)