"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Github, Loader2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function GithubLogin() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message ?? "Something went wrong while trying to sign you in with GitHub.")
            } else {
                toast.error("Something went wrong while trying to sign you in with GitHub.")
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Button variant="outline" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2Icon className="animate-spin mr-2" />
                        <span>Signing in...</span>
                    </>
                ) : (
                    <>
                        <Github className="mr-2" />
                        <span>Sign in with GitHub</span>
                    </>
                )}
            </Button>
        </form>
    )
}