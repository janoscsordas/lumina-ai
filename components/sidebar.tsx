"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  SquarePen,
  SearchIcon,
  Loader2Icon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import UserAvatar from "./user-avatar";
import { User } from "better-auth";
import { useQuery } from "@tanstack/react-query";
import { Chat } from "@/database/schema/chat-schema";
import { Skeleton } from "./ui/skeleton";
import SearchMenu from "./search-menu";

interface SidebarProps {
  user: User | null;
  currentChatId?: string;
}

const Sidebar = ({ user, currentChatId }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      if (user === null) {
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
    <div className={`relative`}>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-15 top-5.5 flex justify-center z-10 items-center border shadow-md bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </Button>
      <div
        className={`h-screen flex flex-col border-r bg-background transition-all duration-300 ${
          isCollapsed ? "hidden" : "w-64"
        }`}
      >
        {/* Logo and title */}
        <div className="px-3 pt-[1.425rem] pb-4 flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold">Lumina AI</h1>
          <div className="flex items-center gap-2">
            <SearchMenu open={isOpen} setOpen={setIsOpen} />
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
            <Link href="/">
              <Button
                size="icon"
                variant="ghost"
                className="w-7 h-7 cursor-pointer"
              >
                <SquarePen className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Chat history */}
        <ScrollArea className="flex-grow h-1 overflow-y-auto px-3">
          {isLoading ? (
            <Skeleton className="w-full justify-start py-8 mt-2">
              <Loader2Icon className="w-5 h-5 animate-spin mx-auto" />
            </Skeleton>
          ) : (
            <div className="space-y-2 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground pb-2">
                Chat History
              </h2>
              <div className="flex flex-col gap-1">
                {chatHistory && chatHistory.length > 0 ? (
                  chatHistory.map((chat) => (
                    <Link href={`/chat/${chat.id}`} key={chat.id}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start py-6 cursor-pointer ${
                          isCollapsed ? "px-2" : ""
                        } ${chat.id === currentChatId ? "bg-accent" : ""}`}
                        title={chat.title}
                      >
                        <MessageSquare
                          className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"}`}
                        />
                        <div className="flex flex-col items-start">
                          <span className="text-sm truncate">{chat.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {chat.createdAt
                              ? new Date(chat.createdAt).toLocaleDateString()
                              : "No date available"}
                          </span>
                        </div>
                      </Button>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No chat history available.
                  </p>
                )}
                {chatHistory && chatHistory.length === 10 && (
                  <Link
                    href="/history"
                    className="text-sm text-muted-foreground flex items-center gap-2 mx-2 mt-3 hover:text-lime-600 dark:hover:text-lime"
                  >
                    <span>Show more</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* User navbar at bottom */}
        {user ? (
          <div className="border-t p-3">
            <div className={`flex items-center gap-2`}>
              <UserAvatar user={user} />
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {user?.name || "User Name"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t p-3">
            <div className="flex items-center gap-4">
              <Link href="/login" className="flex-grow">
                <Button className="w-full" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="flex-grow">
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
