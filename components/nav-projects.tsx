"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"; // Import sidebar components
import { usePathname, useRouter } from "next/navigation"; // Import usePathname hook
import { cn } from "@/lib/utils";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "flex items-center p-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" // Active state styles
                    : "text-foreground hover:bg-accent" // Inactive state styles
                )}
              >
                <div 
                  onClick={() => {
                    router.push(item.url)
                  }}
                 className="flex items-center w-full">
                  <item.icon className="mr-2 size-4" /> {/* Use shadcn/ui icon sizing */}
                  <span>{item.name}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}