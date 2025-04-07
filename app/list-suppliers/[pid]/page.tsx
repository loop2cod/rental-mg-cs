'use client'
import data, { AppSidebar } from "@/components/app-sidebar"
import { withAuth } from "@/components/Middleware/withAuth"
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
  const [supplier, setSupplier] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSupplier = async () => {
    setIsLoading(true);
    try {
      const response = await get<ResponseType>(`${API_ENDPOINTS.SUPPLIERS.OVERVIEW}/${pid}`, {
        withCredentials: true,
      });
      if (response.success) {
        setSupplier(response.data);
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
    fetchSupplier();
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
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/list-suppliers">View Suppliers</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Supplier overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-4">
            <SupplierOverview data={supplier} loading={isLoading}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default withAuth(Page);