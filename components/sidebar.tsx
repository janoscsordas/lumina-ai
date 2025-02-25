"use client"

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  LogOut, 
  Settings, 
  User
} from "lucide-react";

interface SidebarProps {
    user: {
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null; 
    } | null;
}

const Sidebar = ({ user }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Sample chat history data
  const chatHistory = [
    { id: 1, title: "Getting started with the API", date: "2 hours ago" },
    { id: 2, title: "Deployment options", date: "Yesterday" },
    { id: 3, title: "Authentication methods", date: "3 days ago" },
    { id: 4, title: "Handling webhooks", date: "1 week ago" },
    { id: 5, title: "Rate limiting strategies", date: "2 weeks ago" },
  ];

  return (
    <div className={`relative h-screen flex flex-col border-r bg-background transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border shadow-md bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      {/* Logo and title */}
      <div className="px-3 pt-[1.425rem] pb-4 flex items-center gap-2">
        {!isCollapsed && <h1 className="text-xl font-bold">Lumina{" "}AI</h1>}
      </div>
      
      {/* Chat history */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-2">
          {!isCollapsed && <h2 className="text-sm font-semibold text-muted-foreground pb-2">Chat History</h2>}
          {chatHistory.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
              title={chat.title}
            >
              <MessageSquare className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
              {!isCollapsed && (
                <div className="flex flex-col items-start">
                  <span className="text-sm truncate">{chat.title}</span>
                  <span className="text-xs text-muted-foreground">{chat.date}</span>
                </div>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      {/* User navbar at bottom */}
      <div className="border-t p-3">
        <div className={`flex items-center gap-2`}>
          <Avatar className={`h-8 w-8 ${isCollapsed && "mx-auto"}`}>
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="flex flex-1 items-center justify-between">
                <div>
                    <p className="text-sm font-medium">{user?.name || "User Name"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;