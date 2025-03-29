import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function LikeButton({
    chatId,
    messageId,
    isUpvoted
}: {
    chatId: string,
    messageId: string,
    isUpvoted: boolean | null | undefined
}) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({ chatId, messageId, isUpvote }: { chatId: string; messageId: string, isUpvote: boolean }) => {
            const res = await fetch("/api/vote", {
                method: "POST",
                body: JSON.stringify({ chatId, messageId, isUpvote })
            })

            if (!res.ok) {
                throw new Error("Failed to upvote message")
            }

            return res
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["votes"]
            })
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to upvote message")
        }
    })

    const handleVoteMessage = async (isUpvote: boolean) => {
        mutation.mutate({ chatId, messageId, isUpvote });
    }

    return (
        <>
            {(isUpvoted === null || isUpvoted === undefined) ? (
                <>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleVoteMessage(true)}>
                                <ThumbsUp className={cn("h-4 w-4")} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Good response</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleVoteMessage(false)}>
                                <ThumbsDown className={cn("h-4 w-4")} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Bad response</p>
                        </TooltipContent>
                    </Tooltip>
                </>
            ) : isUpvoted ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                            <ThumbsUp className={cn("h-4 w-4", isUpvoted && "fill-foreground")} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Good response</p>
                    </TooltipContent>
                </Tooltip>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                            <ThumbsDown className={cn("h-4 w-4", !isUpvoted && "fill-foreground")} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Bad response</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </>
    )
}