"use client";

import * as React from "react"
import { Loader2Icon, SearchIcon, SquarePen } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Chat } from "@/database/schema/chat-schema";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { NavUser } from "./nav-user";
import SearchMenu from "./search-menu";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id?: string }>();
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      if (session?.user === null) {
        return [];
      }
      const res = await fetch("/api/chat-history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const { data } = await res.json();
      return data as Chat[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
    staleTime: 0,
  });

  const chatHistory = chats;

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between px-2 pt-2">
            <h1 className="font-semibold">Lumina AI</h1>
            <div className="flex items-center gap-2">
              <SearchMenu open={isOpen} setOpen={setIsOpen} />
              <Button className="w-6 h-6 flex items-center justify-center" onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon">
                <SearchIcon className="w-4 h-4" />
              </Button>
              <Link href="/">
                <Button className="w-6 h-6 flex items-center justify-center" variant="ghost" size="icon">
                  <SquarePen className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {!isLoading ? chatHistory && chatHistory.length > 0 ? chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id} title={chat.title}>
                  <SidebarMenuButton asChild className={`${params.id === chat.id && "bg-muted"}`}>
                    <Link href={`/chat/${chat.id}`} className="font-medium truncate text-ellipsis">
                      {chat.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )) : (
                session?.user ? (
                  <SidebarMenuItem className="px-2 py-2 text-muted-foreground text-sm">No chat history found.</SidebarMenuItem>
                ) : (
                  <SidebarMenuItem className="px-2 py-2 text-muted-foreground text-sm">Login to view chat history.</SidebarMenuItem>
                )
              ) : (
                <Skeleton className="w-full justify-start py-8 mt-2">
                  <Loader2Icon className="w-5 h-5 animate-spin mx-auto" />
                </Skeleton>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!isPending ? session?.user ? (
          <NavUser user={session?.user} />
        ) : (
          <div className="flex w-full justify-center items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </Link>
          </div>
        ) : (
          <Skeleton className="py-4">
            <Loader2Icon className="w-5 h-5 animate-spin mx-auto" />
          </Skeleton>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
