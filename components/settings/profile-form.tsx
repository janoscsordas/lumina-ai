"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { DeleteHistoryDialog } from "./delete-history-dialog"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"
import { User } from "better-auth"
import { Label } from "../ui/label"
import { changeUserNameAction } from "@/actions/user.action"

const profileFormSchema = z.object({
  displayName: z
    .string()
    .min(4, {
      message: "Display name must be at least 4 characters.",
    })
    .max(30, {
      message: "Display name cannot be longer than 30 characters.",
    }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm({ user }: { user: User }) {
  const [isDeleteHistoryOpen, setIsDeleteHistoryOpen] = useState(false)
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user.name,
    },
    mode: "onChange",
  })

  async function onSubmit(data: ProfileFormValues) {
    const { success, error } = await changeUserNameAction({ userId: user.id, name: data.displayName })

    if (!success) {
      toast.error(error)
      return;
    }

    toast.success("Display name updated")
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

          <Label htmlFor="email">
            Email
          </Label>
          <Input type="email" readOnly defaultValue={user.email} className="mt-1 mb-2" disabled />
          <p className="text-sm text-muted-foreground">For security reasons, you can&apos;t change your email address.</p>

          <Button type="submit" className="cursor-pointer" variant="outline">Update profile</Button>
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
            <Button variant="outline" className="w-fit cursor-pointer" onClick={() => setIsDeleteHistoryOpen(true)}>
              Delete chat history
            </Button>
          </div>

          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-destructive">Danger Zone</h4>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
            <Button variant="destructive" className="w-fit cursor-pointer" onClick={() => setIsDeleteAccountOpen(true)}>
              Delete account
            </Button>
          </div>
        </div>
      </div>

      <DeleteHistoryDialog open={isDeleteHistoryOpen} onOpenChange={setIsDeleteHistoryOpen} userId={user.id} />

      <DeleteAccountDialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen} userId={user.id} />
    </div>
  )
}