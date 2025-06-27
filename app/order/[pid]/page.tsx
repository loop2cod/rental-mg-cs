'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { withAuth } from "@/components/Middleware/withAuth"
import ConvertOrder from "@/components/Order/ConvertOrder"
import CreatePreBooking from "@/components/PreBooking/CreatePreBooking"
import EditPreBooking from "@/components/PreBooking/EditPreBooking"
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
import { useEffect, useLayoutEffect, useState } from "react"


type ResponseType = {
  success: boolean;
  data?: any;
  message?: string;
}
const Page = () => {
    const {pid} = useParams()
const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])

  // Fetch categories from the API
  const fetchProducts = async () => {
    try {
      // setLoading(true) // Start loading
      const response = await get<ResponseType>(API_ENDPOINTS.INVENTORY.GET_ALL_WITH_QUANTITY,{withCredentials: true})
      if (response.success) {
        setProducts(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch Products",
          variant: "destructive",
        })
    }
  }catch (error:any) {
    console.log(error)
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to fetch Products",
          variant: "destructive",
        })
    }finally{
      setLoading(false); // End loading
    }
  }

  useEffect(() => {
    fetchProducts()
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
<ConvertOrder products={products} fetchProducts={fetchProducts} loading={loading} bookingId={pid}/>
</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(Page)