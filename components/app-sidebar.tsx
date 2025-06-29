"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Calendar,
  DotIcon,
  FileText,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  List,
  Map,
  Package,
  PackageCheck,
  PieChart,
  PlusCircle,
  Settings2,
  SquareTerminal,
  Truck,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import AddSupplier from "./AddSupplier"


const data = {
  user: {
    name: "Admin",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Inventory",
      url: "#",
      icon: Package,
      items: [
        {
          title: "View Inventory",
          url: "/list-inventory",
          icon: List,
        },
        {
          title: "Add Product",
          url: "/add-product",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Pre-Booking",
      icon: Calendar,
      items: [
        {
          title: "Create Pre-Booking",
          url: "/pre-booking",
          icon: FileText,
        },
        {
          title: "View Pre-Bookings",
          url: "/list-pre-bookings",
          icon: List,
        },
      ],
    },
    {
      title: "Suppliers",
      icon: Truck,
      items: [
        {
          title: "View Suppliers",
          url: "/list-suppliers",
          icon: List,
        },
        {
          title: "Add Supplier",
          url: "/add-supplier",
          icon: PlusCircle,
          buttonComponent: <AddSupplier />
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/momenz-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      url: "/list-orders",
      icon: PackageCheck,
    },
  ],
};

export default data;
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div
          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-primary-foreground-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-primary-foreground-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-primary-foreground-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-primary-foreground-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <img src="/logo.svg" alt="Logo" className="h-9 mx-auto filter-primary" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
