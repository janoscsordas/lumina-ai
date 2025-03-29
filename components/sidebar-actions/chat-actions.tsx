import { Check, Copy, Link, MoreHorizontal, Share, Star, Trash2 } from "lucide-react";
import { SidebarMenuAction, useSidebar } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Chat } from "@/database/schema/chat-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { changeFavoriteStatusForChat, shareChat } from "@/actions/chat.action";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function ChatActions({ chat }: { chat: Chat }) {
  const pathName = usePathname();
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [url, setUrl] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/chat", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete chat");

      return res;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chat-history"] });

      if (pathName !== "/") {
        router.push("/");
      } else {
        router.refresh();
      }

      toast.success("Chat deleted successfully!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    },
  });

  const favouriteMutation = useMutation({
    mutationFn: async ({
      chatId,
      isFavorite,
    }: {
      chatId: string;
      isFavorite: boolean;
    }) => {
      const response = await changeFavoriteStatusForChat({
        chatId,
        isFavorite,
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: async ({ message }) => {
      toast.success(message || "Successfully updated chat's status.");
      await queryClient.invalidateQueries({
        queryKey: ["chat-history"],
      });
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "There was an error while we tried to change your chat's status"
      );
    },
  });

  const shareMutation = useMutation({
    mutationFn: async ({ chatId }: { chatId: string }) => {
        const response = await shareChat({ chatId })

        if (!response.success) {
            throw new Error(response.error)
        }

        return response
    },
    onSuccess: async ({ message, data }) => {
        await queryClient.invalidateQueries({
            queryKey: ["chat-history"]
        })
        setUrl(data ?? "")
        toast.success(message || "Successfully shared chat.")
    },
    onError: (error: unknown) => {
        toast.error(error instanceof Error ? error.message : "There was an error while trying to share your chat.")
    }
  })

  return (
    <AlertDialog>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              showOnHover
              className="bg-sidebar shadow-lg hover:bg-sidebar"
            >
              <MoreHorizontal />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
          >
            <DropdownMenuItem
              onClick={() =>
                favouriteMutation.mutate({
                  chatId: chat.id,
                  isFavorite: chat.isFavorite,
                })
              }
            >
              <Star
                className={`text-muted-foreground ${
                  chat.isFavorite ? "fill-yellow-500" : ""
                }`}
              />
              <span>{chat.isFavorite ? "Unfavorite" : "Favorite"}</span>
            </DropdownMenuItem>
            {
                chat.visibility === "private" ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => shareMutation.mutate({ chatId: chat.id })}>
                                <Share className="text-muted-foreground" />
                                <span>{shareMutation.isPending ? "Sharing..." : "Share"}</span>
                            </DropdownMenuItem>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side={`${isMobile ? "top" : "right"}`}>
                            <p>
                            Clicking on this will automatically change the visibility of
                            your chat.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <Link className="text-muted-foreground" />
                            <span>Copy link</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                )
            }
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-500 focus:text-red-500">
                <Trash2 className="text-red-500" />
                <span>Delete</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who is logged in and has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={`${process.env.NEXT_PUBLIC_APP_URL}/chat/${chat.id}`}
                readOnly
                disabled={shareMutation.isPending}
              />
            </div>
            <Button size="sm" disabled={shareMutation.isPending} variant="outline" className="px-3" onClick={() => {
                navigator.clipboard.writeText(url || `${process.env.NEXT_PUBLIC_APP_URL}/chat/${chat.id}`)
                setIsCopied(true)
                toast.success("Link copied successfully!")

                setTimeout(() => {
                    setIsCopied(false)
                }, 5000)
            }}>
              <span className="sr-only">Copy</span>
              {isCopied ? (
                <Check />
            ) : (
                <Copy />
              )}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove this chat?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Clicking on delete will remove this
            chat from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteMutation.isPending}
            className="text-red-100 bg-red-700 hover:bg-red-800"
            onClick={() => deleteMutation.mutate(chat.id)}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
