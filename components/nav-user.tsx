"use client"

import {
  ChevronsUpDown,
  HistoryIcon,
  LogOutIcon,
  Moon,
  SettingsIcon,
  Sun,
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
import { User } from "better-auth"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { authClient } from "@/lib/auth-client"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function NavUser({
  user,
}: {
  user: User | undefined
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  
  const { isMobile } = useSidebar()

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        toast.promise(async () => {
          await authClient.signOut();
          router.push("/");
  
          setTimeout(async () => {
            await queryClient.invalidateQueries({
              queryKey: ["chat-history"],
            });
            window.location.reload();
          }, 300)
        }, {
          loading: "Signing out...",
          success: "Signed out successfully",
          error: "Sign out failed",
        });
      } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          }
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image || ""} alt={user?.name} />
                <AvatarFallback className="rounded-lg">{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "top" : "right"}
            align="center"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image || ""} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/settings">
                <DropdownMenuItem>
                    <SettingsIcon />
                    Settings
                </DropdownMenuItem>
              </Link>
              <Link href="/history">
                <DropdownMenuItem>
                    <HistoryIcon />
                    History
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
              <LogOutIcon />
              {isLoading ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-2 font-medium text-muted-foreground text-xs">
                Preferences
              </DropdownMenuLabel>
              <div className="flex items-center justify-between gap-2 px-2 pb-1 text-left text-sm">
                <span className="truncate">Theme</span>
                  <div
                    className="flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300 bg-sidebar border border-muted"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div
                        className={cn(
                          "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                          isDark 
                            ? "transform translate-x-0 bg-muted" 
                            : "transform translate-x-8 bg-muted"
                        )}
                      >
                        {isDark ? (
                          <Moon 
                            className="w-4 h-4 text-white" 
                            strokeWidth={1.5}
                          />
                        ) : (
                          <Sun 
                            className="w-4 h-4 text-gray-700" 
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                          isDark 
                            ? "bg-transparent" 
                            : "transform -translate-x-8"
                        )}
                      >
                        {isDark ? (
                          <Sun 
                            className="w-4 h-4 text-gray-500" 
                            strokeWidth={1.5}
                          />
                        ) : (
                          <Moon 
                            className="w-4 h-4 text-black" 
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
