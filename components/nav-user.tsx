"use client"

import {
  BadgeCheck,
  Bell,
  Check,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "@/hooks/useTheme"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Button } from "./ui/button"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email?: string
    avatar?: string
  }
}) {
  const { isMobile } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  const [selectedColor, setSelectedColor] = useState("Zinc");
  const colorOptions = [
    { name: "Zinc", color: "bg-zinc-600" },
    { name: "Red", color: "bg-red-600" },
    { name: "Rose", color: "bg-rose-600" },
    { name: "Orange", color: "bg-orange-600" },
    { name: "Green", color: "bg-green-600" },
    { name: "Blue", color: "bg-blue-600" },
    { name: "Yellow", color: "bg-yellow-600" },
    { name: "Violet", color: "bg-violet-600" },
  ];
  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light"
    toggleTheme(nextTheme)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-xl">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl">AD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Sparkles />
                    Dark Theme
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={handleThemeToggle}
                  />
                </div>
              </DropdownMenuItem>
              <div className="grid grid-cols-2 gap-1">
      {colorOptions.map((option) => (
        <Button
          key={option.name}
          variant={selectedColor === option.name ? "default" : "outline"}
          className={`flex items-center  p-0.5 rounded-xl text-xs hover:bg-primary/10 ${
            selectedColor === option.name ? "border border-primary bg-secondary text-secondary-foreground" : ""
          }`}
          onClick={() => setSelectedColor(option.name)}
        >
          {/* Color Circle */}
          <span
            className={`w-4 h-4 rounded-full ${option.color}`}
          ></span>
          {/* Label */}
          <span>{option.name}</span>
          {/* Checkmark if selected */}
          {selectedColor === option.name && (
            <Check className="w-5 h-5 text-secondary-foreground" />
          )}
        </Button>
      ))}
    </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}