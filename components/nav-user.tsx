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
import { ColorTheme } from "@/context/ThemeContext"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { post } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { toast } from "./ui/use-toast"


interface AuthResponse {
  success: boolean;
  data?: any;
  message?: string;
  sessionOut?: boolean;
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email?: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { theme, toggleTheme, colorTheme, toggleColorTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState(colorTheme);

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    toggleTheme(nextTheme);
  };

  const handleColorChange = (color: ColorTheme) => {
    setSelectedColor(color);
    toggleColorTheme(color);
  };

  const colorOptions = [
    { name: "Zinc", value: "zinc", color: "bg-zinc-600" },
    { name: "Red", value: "red", color: "bg-red-600" },
    { name: "Rose", value: "rose", color: "bg-rose-600" },
    { name: "Orange", value: "orange", color: "bg-orange-600" },
    { name: "Green", value: "green", color: "bg-green-600" },
    { name: "Blue", value: "blue", color: "bg-blue-600" },
    { name: "Yellow", value: "yellow", color: "bg-yellow-600" },
    { name: "Violet", value: "violet", color: "bg-violet-600" },
  ];

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await post<AuthResponse>(API_ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true });

      if (response.success) {
        router.push('/auth');
      }
    } catch (error:any) {
      toast({
          title: 'Error',
          description: error.response?.data?.message || error.message || 'Failed to verify authentication',
          variant: 'destructive',
      })
    }
  };

  return (
<SidebarMenu>
  <SidebarMenuItem>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className={cn(
            "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          )}
        >
          <Avatar className="h-8 w-8 rounded-xl">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-xl">AD</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover"
        )}
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
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Bell className="mr-2 size-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Sparkles className="mr-2 size-4" />
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
                key={option.value}
                variant={selectedColor === option.value ? "default" : "outline"}
                className={cn(
                  "flex items-center p-0.5 rounded-xl text-xs hover:bg-accent/10",
                  selectedColor === option.value &&
                    "border border-primary bg-secondary text-secondary-foreground"
                )}
                onClick={() => handleColorChange(option.value as ColorTheme)}
              >
                <span className={`w-4 h-4 rounded-full ${option.color}`}></span>
                <span>{option.name}</span>
                {selectedColor === option.value && (
                  <Check className="w-5 h-5 text-secondary-foreground" />
                )}
              </Button>
            ))}
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</SidebarMenu>
  );
}