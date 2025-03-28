import { MoreHorizontal, Share, Star, Trash2 } from "lucide-react";
import { SidebarMenuAction, useSidebar } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Chat } from "@/database/schema/chat-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";


export default function ChatActions({ chat }: { chat: Chat }) {
    const pathName = usePathname()
    const queryClient = useQueryClient()
    const { isMobile } = useSidebar();
    const router = useRouter();

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
          toast.error(error instanceof Error ? error.message : "Something went wrong.");
        },
    });

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover className="bg-sidebar shadow-lg hover:bg-sidebar">
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                    </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                >
                    <DropdownMenuItem>
                        <Star className="text-muted-foreground" />
                        <span>Favorite</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Share className="text-muted-foreground" />
                        <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                            <Trash2 className="text-red-500" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to remove this chat?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Clicking on delete will remove this chat from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction className="text-red-100 bg-red-700 hover:bg-red-800" onClick={() => deleteMutation.mutate(chat.id)}>
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}