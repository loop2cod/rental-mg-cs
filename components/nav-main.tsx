"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
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
import { cn } from "@/lib/utils"

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
        // Check if the parent URL matches the current pathname
        const isParentActive = item.url ? pathname === item.url : false;
        // Check if any sub-item URL matches the current pathname
        const isChildActive = item.items
          ? item.items.some((subItem) => pathname === subItem.url)
          : false;
        // Set isActive to true if either the parent or any child is active
        const isActive = isParentActive || isChildActive;

        return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isActive} // Open the collapsible if the parent or any child is active
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild className="mx-auto">
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md transition-colors text-muted-foreground hover:bg-accent/10 mb-2",
                    isActive && "bg-accent text-accent-foreground"
                  )}
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
                      const isSubActive = pathname === subItem.url;

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "flex items-center w-full p-2 rounded-md transition-colors",
                              isSubActive
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "text-muted-foreground hover:bg-accent"
                            )}
                          >
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  </SidebarGroup>
  )
}