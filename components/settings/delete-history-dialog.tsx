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

interface DeleteHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteHistoryDialog({ open, onOpenChange }: DeleteHistoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteHistory() {
    setIsDeleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsDeleting(false)
    onOpenChange(false)

    toast("Chat history deleted")
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

