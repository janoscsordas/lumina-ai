"use client"

import { Chat } from "@/database/schema/chat-schema";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function HistoryList({
    chatHistory
}: {
    chatHistory: Chat[]
}) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const handleDelete = async (id: string) => {
        const response = await fetch(`/api/chat`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })

        if (!response.ok) {
            const data = await response.json();
            toast.error(data.error);
            return;
        }

        const data = await response.json();
        toast.success(data.message);
        queryClient.invalidateQueries({
            queryKey: ["chat-history"],
        });
        router.refresh();
    }

    return (
        <div className="w-full mx-auto p-4">
            {chatHistory.map((chat) => (
                <Card
                    key={chat.id}
                    className="w-full transition-all border border-border dark:hover:border-lime group my-2"
                >
                    <CardContent className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h3 className="font-medium text-sm line-clamp-1">{chat.title}</h3>
                        <p className="text-xs text-muted-foreground">{formattedDate.format(new Date(chat.createdAt))}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}
                        onClick={() => handleDelete(chat.id)}
                        aria-label="Delete chat"
                    >
                        <Trash2 className="h-4 w-4 text-red-500 dark:text-red-600" />
                    </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}