'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { InventoryTable } from "@/components/Inventory/InventoryTable"
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
import { del, get } from "@/utilities/AxiosInterceptor"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ResponseType {
  success: boolean;
  data?: any;
  message?: string;
}

const Page = () => {
  const router = useRouter()
  const [inventory, setInventory] = useState<any>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
                  <BreadcrumbPage>View Inventory</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>
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
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(Page)