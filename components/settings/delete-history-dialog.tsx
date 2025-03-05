"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { deleteChatHistory } from "@/actions/chat.action"

interface DeleteHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function DeleteHistoryDialog({ open, onOpenChange, userId }: DeleteHistoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteHistory() {
    setIsDeleting(true)

    const { success, error } = await deleteChatHistory({ userId })

    setIsDeleting(false)
    onOpenChange(false)

    if (!success) {
      toast.error(error)
      return
    }

    toast.success("Chat history deleted successfully!")
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Chat History</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all your conversations with the AI assistant. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={deleteHistory} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete History"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

