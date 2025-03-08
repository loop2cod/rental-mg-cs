"use client"

import {
  type LucideIcon,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation" // Import usePathname hook

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = pathname === item.url

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild className={`${
                    isActive
                      ? "bg-primary text-secondary hover:bg-primary/90 hover:text-secondary"
                      : "text-secondary-foreground hover:bg-secondary"
                  }`}>
                <a
                  href={item.url}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-secondary hover:bg-primary/90 hover:text-secondary"
                      : "text-secondary-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="mr-2" />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}