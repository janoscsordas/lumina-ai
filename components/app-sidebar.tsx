"use client";

import * as React from "react";
import { ArrowRight, Loader2Icon, SquarePen } from "lucide-react";

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
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Chat } from "@/database/schema/chat-schema";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import ChatActions from "./sidebar-actions/chat-actions";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ id?: string }>();
  const { data: session, isPending } = authClient.useSession();

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

  const chatHistory = React.useMemo(() => {
    if (!chats) return { today: [], last7Days: [], earlier: [] };

    const today = new Date();
    const isSameDay = (date1: Date, date2: Date) =>
      date1.toDateString() === date2.toDateString();

    const isWithinLast7Days = (date: Date) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      return date > sevenDaysAgo && !isSameDay(date, today);
    };

    const categorizedChats = {
      today: [] as Chat[],
      last7Days: [] as Chat[],
      earlier: [] as Chat[],
    };

    chats.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);
      if (isSameDay(chatDate, today)) {
        categorizedChats.today.push(chat);
      } else if (isWithinLast7Days(chatDate)) {
        categorizedChats.last7Days.push(chat);
      } else {
        categorizedChats.earlier.push(chat);
      }
    });

    return categorizedChats;
  }, [chats]);

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between px-2 pt-2">
            <h1 className="font-semibold">Lumina AI</h1>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button
                  className="w-6 h-6 flex items-center justify-center"
                  variant="ghost"
                  size="icon"
                >
                  <SquarePen className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {!isLoading ? (
                <>
                  {Object.entries(chatHistory).map(
                    ([group, chats]) =>
                      chats.length > 0 && (
                        <React.Fragment key={group}>
                          <SidebarGroupLabel>
                            {group === "today"
                              ? "Today"
                              : group === "last7Days"
                              ? "Last 7 Days"
                              : "Earlier"}
                          </SidebarGroupLabel>
                          {chats.map((chat) => (
                            <SidebarMenuItem
                              key={chat.id}
                              title={chat.title}
                              className="group relative"
                            >
                              <SidebarMenuButton
                                asChild
                                className={`${
                                  params.id === chat.id && "bg-muted"
                                }`}
                              >
                                <Link
                                  href={`/chat/${chat.id}`}
                                  className="font-medium truncate text-ellipsis"
                                >
                                  {chat.title}
                                </Link>
                              </SidebarMenuButton>
                              <ChatActions chat={chat} />
                            </SidebarMenuItem>
                          ))}
                        </React.Fragment>
                      )
                  )}
                </>
              ) : (
                <Skeleton className="w-full justify-start py-8 mt-2">
                  <Loader2Icon className="w-5 h-5 animate-spin mx-auto" />
                </Skeleton>
              )}
              {session?.user &&
                Object.values(chatHistory).some(
                  (group) => group.length > 0
                ) && (
                  <SidebarMenuItem className="px-2 text-muted-foreground text-sm">
                    <Link
                      href="/history"
                      className="hover:underline flex items-center gap-2"
                    >
                      View all <ArrowRight className="w-4 h-4" />
                    </Link>
                  </SidebarMenuItem>
                )}
              {!isLoading &&
                session?.user &&
                Object.values(chatHistory).every(
                  (group) => group.length === 0
                ) && (
                  <SidebarMenuItem className="px-2 py-2 text-muted-foreground text-sm">
                    No chat history found.
                  </SidebarMenuItem>
                )}
              {!isLoading && !session?.user && (
                <SidebarMenuItem className="px-2 py-2 text-muted-foreground text-sm">
                  Login to view chat history.
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!isPending ? (
          session?.user ? (
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
          )
        ) : (
          <Skeleton className="py-4">
            <Loader2Icon className="w-5 h-5 animate-spin mx-auto" />
          </Skeleton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
