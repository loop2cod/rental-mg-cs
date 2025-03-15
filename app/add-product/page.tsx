'use client';
import { AppSidebar } from "@/components/app-sidebar"
import AddProductForm from "@/components/Inventory/AddProductForm"
import CategoryManagement from "@/components/Inventory/CategoryManagement"
import { withAuth } from "@/components/Middleware/withAuth";
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

interface Category {
  _id: string
  name: string
}

interface ResponseType {
  success: boolean;
  data?: any;
  message?: string;
}

const Page = () => {
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await get<ResponseType>(API_ENDPOINTS.CATEGORY.GET_ALL,{withCredentials: true})
      if (response.success) {
        console.log("Successfully fetched categories:", response.data)
        setCategories(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch categories",
          variant: "destructive",
        })
    }
  } catch (error:any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to fetch categories",
          variant: "destructive",
        })
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
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
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add product</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-2 lg:px-4">
            <div className="lg:col-span-2">
              <AddProductForm categories={categories}/>
            </div>
            <div className="lg:col-span-1">
              <CategoryManagement
                categories={categories}
                fetchCategories={fetchCategories}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(Page)