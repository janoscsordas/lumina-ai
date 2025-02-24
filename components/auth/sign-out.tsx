"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignOut() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authClient.signOut();
            toast.success("Signed out successfully");
            router.push("/");
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
            <Button variant="destructive" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2Icon className="animate-spin" />
                        <span>Signing Out...</span>
                    </>
                ) : <span>Sign Out</span>}
            </Button>
        </form>
    )
}