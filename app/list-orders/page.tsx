'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { withAuth } from "@/components/Middleware/withAuth"
import OrderTable from "@/components/Order/OrderTable"
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
import { useEffect, useState } from "react"


interface ResponseType {
  success: boolean;
  data?: any;
  message?: string;
}

const Page = () => {
    const [orders, setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = async (page: number = 1, limit: number = 10, search: string = "") => {
      setIsLoading(true);
      try {
        const response = await get<ResponseType>(API_ENDPOINTS.ORDER.GET_ALL, {
          params: { page, limit, search },
          withCredentials: true,
        });
        if (response.success) {
          setOrders(response.data?.orders);
          setTotalPages(response.data?.pagination?.totalPages);
          setTotalCount(response.data?.pagination?.totalItems);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch Suppliers",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to fetch Suppliers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchOrders(currentPage, itemsPerPage, searchTerm);
    }, [currentPage, itemsPerPage, searchTerm]);


    const handleSearch = (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
  
    const handlePageSizeChange = (size: number) => {
      setItemsPerPage(size);
      setCurrentPage(1);
    };
  

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
                  <BreadcrumbLink href="/">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>List orders</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
    <div>
    <OrderTable
            onSearch={handleSearch}
            isLoading={isLoading}
            orders={orders}
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