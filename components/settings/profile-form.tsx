"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { DeleteHistoryDialog } from "./delete-history-dialog"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"

const profileFormSchema = z.object({
  displayName: z
    .string()
    .min(2, {
      message: "Display name must be at least 2 characters.",
    })
    .max(30, {
      message: "Display name cannot be longer than 30 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API
const defaultValues: Partial<ProfileFormValues> = {
  displayName: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  bio: "AI enthusiast and tech lover",
}

export function ProfileForm() {
  const [isDeleteHistoryOpen, setIsDeleteHistoryOpen] = useState(false)
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    toast("Profile Updated")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-muted-foreground">Update your personal details and how the AI addresses you.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>This is the name the AI will use to address you.</FormDescription>
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
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormDescription>Your email address for notifications.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>This helps the AI understand your interests.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update profile</Button>
        </form>
      </Form>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Data Management</h3>
        <p className="text-sm text-muted-foreground mb-4">Manage your chat history and account data.</p>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium">Chat History</h4>
            <p className="text-sm text-muted-foreground">Delete all your chat history with the AI assistant.</p>
            <Button variant="outline" className="w-fit" onClick={() => setIsDeleteHistoryOpen(true)}>
              Delete chat history
            </Button>
          </div>

          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-destructive">Danger Zone</h4>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
            <Button variant="destructive" className="w-fit" onClick={() => setIsDeleteAccountOpen(true)}>
              Delete account
            </Button>
          </div>
        </div>
      </div>

      <DeleteHistoryDialog open={isDeleteHistoryOpen} onOpenChange={setIsDeleteHistoryOpen} />

      <DeleteAccountDialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen} />
    </div>
  )
}