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
import { useState } from "react"


export const initialInventoryData: any = [
  {
    _id: "inventory_id_1",
    product_id: {
      _id: "product_id_1",
      name: "Product A",
      unit_cost: 100,
      features: {
        color: "red",
        size: "large",
      },
      image1: "/placeholder.svg?height=200&width=200",
      category_id: "category_id_1",
    },
    quantity: 50,
  },
  {
    _id: "inventory_id_2",
    product_id: {
      _id: "product_id_2",
      name: "Product B",
      unit_cost: 200,
      features: {
        color: "blue",
        size: "medium",
      },
      image1: "/placeholder.svg?height=200&width=200",
      category_id: "category_id_2",
    },
    quantity: 30,
  },
  {
    _id: "inventory_id_3",
    product_id: {
      _id: "product_id_3",
      name: "Product C",
      unit_cost: 150,
      features: {
        color: "green",
        size: "small",
      },
      image1: "/placeholder.svg?height=200&width=200",
      category_id: "category_id_1",
    },
    quantity: 75,
  },
  {
    _id: "inventory_id_4",
    product_id: {
      _id: "product_id_4",
      name: "Product D",
      unit_cost: 300,
      features: {
        color: "black",
        size: "large",
      },
      image1: "/placeholder.svg?height=200&width=200",
      category_id: "category_id_3",
    },
    quantity: 15,
  },
]

const page = () => {
  const [inventory, setInventory] = useState<any>(initialInventoryData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<any | null>(null)

  const handleAddProduct = (newProduct: any, quantity: number) => {
    const newInventoryItem: any = {
      _id: `inventory_id_${Date.now()}`,
      product_id: {
        ...newProduct,
        _id: `product_id_${Date.now()}`,
      },
      quantity,
    }

    setInventory([...inventory, newInventoryItem])
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (updatedItem: any) => {
    setInventory(inventory.map((item:any) => (item._id === updatedItem._id ? updatedItem : item)))
    setIsEditDialogOpen(false)
    setCurrentItem(null)
  }

  const handleDeleteProduct = (id: string) => {
    setInventory(inventory.filter((item:any) => item._id !== id))
  }

  const openEditDialog = (item: any) => {
    setCurrentItem(item)
    setIsEditDialogOpen(true)
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
                  <BreadcrumbLink href="/">
                    Dashboard
                  </BreadcrumbLink>
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
    <InventoryTable inventory={inventory} onEdit={openEditDialog} onDelete={handleDeleteProduct} />
    </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(page)