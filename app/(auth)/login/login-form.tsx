"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email."
    }),
    password: z.string().min(1, {
        message: "Password is required."
    })
})

export default function LoginForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    // getting the loading state out of the form state
    const { isSubmitting } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
        }, {
            onSuccess: () => {
                toast.success("Successfully logged in! Welcome back!")
                router.push('/')
            },
            onError: (ctx) => {
                toast.error(ctx.error.message)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Email" required {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" required {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-muted text-foreground hover:bg-muted cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2Icon className="animate-spin mr-2" />
                            <span>Logging in...</span>
                        </>
                    ) : (
                        <span>Log in</span>
                    )}
                </Button>
            </form>
        </Form>
    )
}