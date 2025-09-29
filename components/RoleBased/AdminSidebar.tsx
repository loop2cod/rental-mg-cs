"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Settings2,
  Users,
  ShoppingCart,
  Plus,
  List,
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

const data = {
  user: {
    name: "Admin",
    avatar: "https://github.com/shadcn.png",
  },
  projects: [
    {
      name: "Dashboard",
      url: "/momenz-dashboard",
      icon: LayoutDashboard,
    },
  ],
  navMain: [
    {
      title: "Purchases",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Add Purchase",
          url: "/admin/purchase/add",
          icon: Plus,
        },
        {
          title: "Purchase History",
          url: "/admin/purchase/history",
          icon: List,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "User Management",
          url: "/admin/settings",
          icon: Users,
        },
      ],
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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