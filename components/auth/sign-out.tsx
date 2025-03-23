"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function SignOut() {
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authClient.signOut();
            toast.success("Signed out successfully");
            router.push("/");
            await queryClient.invalidateQueries({
                queryKey: ["chat-history"]
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <DropdownMenuItem>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center w-full"
                >
                    <LogOut className="mr-2" />
                    {isLoading ? "Logging out..." : "Log out"}
                </button>
            </DropdownMenuItem>
        </form>
    )
}