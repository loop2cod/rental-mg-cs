'use client'
import data, { AppSidebar } from "@/components/app-sidebar"
import { withAuth } from "@/components/Middleware/withAuth"
import OrderOverview from "@/components/Order/OrderOverview"
import SupplierOverview from "@/components/Supplier/SupplierOverview"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
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

interface ResponseType {
  success: boolean;
  data?: any;
  message?: string;
}

const Page = () => {
  const { pid } = useParams()  
  const [order, setOrder] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const response = await get<ResponseType>(`${API_ENDPOINTS.ORDER.GET_BY_ID}/${pid}`, {
        withCredentials: true,
      });
      if (response.success) {
        setOrder(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch Supplier",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch Supplier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchOrder();
  }, []);


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
                  <BreadcrumbLink href="/momenz-dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/list-orders">List orders</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Order details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-4">
            <OrderOverview data={order} loading={isLoading} fetchOrder={fetchOrder} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default withAuth(Page);