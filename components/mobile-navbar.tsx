import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User } from "better-auth";
import UserAvatar from "./user-avatar";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default function MobileNavbar({ user }: { user: User | null }) {

    return (
        <header className="fixed inset-0 w-full h-max px-4 py-2 block xl:hidden bg-background z-50">
            <nav className="flex items-center justify-between gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline" aria-label="Open hamburger menu">
                            <MenuIcon size={16} aria-hidden="true" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-w-64" align="start">
                        <DropdownMenuLabel className="flex flex-col">
                            Menu
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href="/">
                                <DropdownMenuItem>New Chat</DropdownMenuItem>
                            </Link>
                            <Link href="/history">
                                <DropdownMenuItem>Your Chat History</DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                {user ? (
                    <UserAvatar user={user} />
                ) : (
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
                )}
            </nav>
        </header>
    )
}