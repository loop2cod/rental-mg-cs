"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation" // Import usePathname hook
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url?: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname() // Get the current pathname

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.url ? pathname === item.url : false

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`flex items-center w-full p-2 rounded-md transition-colors text-secondary-foreground hover:bg-secondary-foreground/10`}
                  >
                    {item.icon && <item.icon className="mr-2" />}
                    <span>{item.title}</span>
                    {item.items && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive = pathname === subItem.url

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={`flex items-center w-full p-2 rounded-md transition-colors ${
                                isSubActive
                                  ? "bg-primary text-secondary hover:bg-primary/90 hover:text-secondary"
                                  : "text-secondary-foreground hover:bg-secondary"
                              }`}
                            >
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}