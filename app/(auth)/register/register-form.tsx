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
    name: z.string().min(4, {
        message: "Name is required."
    }).max(32, {
        message: "Name must be less than 32 characters."
    }),
    email: z.string().email({
        message: "Invalid email."
    }),
    password: z.string().min(1, {
        message: "Password is required."
    }).min(8, {
        message: "Password must be at least 8 characters."
    }).max(48, {
        message: "Password must be less than 48 characters."
    }).regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
        message: "Password must contain at least 1 capital letter, 1 number, and 1 special character."
    }),
})

export default function RegisterForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })
    // getting the loading state out of the form state
    const { isSubmitting } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
        }, {
            onSuccess: () => {
                // send email function will be here
                // await sendEmail(email)
                toast.success("Successfully signed up!")
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" required {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                            <span>Signing up...</span>
                        </>
                    ) : (
                        <span>Sign up</span>
                    )}
                </Button>
            </form>
        </Form>
    )
}