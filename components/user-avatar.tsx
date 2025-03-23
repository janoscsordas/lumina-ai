"use client"

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { History, Loader2Icon, LogOutIcon, Settings } from "lucide-react";
import { User } from "better-auth";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UserAvatarProps {
  user: User | null;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      toast.promise(async () => {
        await authClient.signOut();
        router.push("/");

        setTimeout(async () => {
          await queryClient.invalidateQueries({
            queryKey: ["chat-history"],
          });
        }, 300)
      }, {
        loading: "Signing out...",
        success: "Signed out successfully",
        error: "Sign out failed",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Sign out failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full cursor-pointer flex justify-center items-center outline-none focus:outline-none"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {user?.name}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings">
            <DropdownMenuItem>
              <Settings size={16} className="opacity-60" aria-hidden="true" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/history">
            <DropdownMenuItem>
              <History size={16} className="opacity-60" aria-hidden="true" />
              <span>History</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
          <LogOutIcon
            size={16}
            className="opacity-60 text-red-500"
            aria-hidden="true"
          />
          <span className="text-red-500">
            {isLoading ? (
              <>
                <Loader2Icon className="animate-spin" />
                <span className="sr-only">Loading...</span>
              </>
            ) : (
              "Sign out"
            )}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
