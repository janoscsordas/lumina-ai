"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Message, useChat } from "@ai-sdk/react";
import { TextShimmer } from "../ui/text-shimmer";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChatMessage } from "../ui/chat-message";
import { useCallback, useEffect, useRef } from "react";
import { ChatInput } from "./chat-input";

export default function ChatComponent({
  id,
  initialMessages,
  selectedChatModel,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string | undefined;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const bottomDivRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    status,
    stop,
  } = useChat({
    id,
    initialMessages,
    onFinish: () => {
      if (!initialMessages || initialMessages.length === 0) {
        queryClient.invalidateQueries({
          queryKey: ["chat-history"],
        });

        router.replace(`/chat/${id}`);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleStop = useCallback(() => {
    if (typeof stop === 'function') {
      stop();
    }
  }, [stop]);

  useEffect(() => {
    if (bottomDivRef.current) {
      bottomDivRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <section className="w-[98%] relative">
      <div className="flex flex-col w-[98%] md:w-[95%] 2xl:w-2/3 min-h-screen mx-auto pt-2">
        <ScrollArea className="h-1 flex-grow px-4 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground dark:[&::-webkit-scrollbar-track]:bg-transparent">
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              id={m.id}
              content={m.content}
              role={m.role}
              className="my-2"
            />
          ))}
          {status === "submitted" && (
            <TextShimmer className="font-mono justify-start mt-3" duration={1}>
              Thinking...
            </TextShimmer>
          )}
          <div ref={bottomDivRef} />
        </ScrollArea>
        {error && (
          <div className="mt-2 text-red-500 text-sm w-max px-7 p-2">
            {error.message ||
              "An error occurred while processing your request."}
          </div>
        )}
        <ChatInput
          selectedChatModel={selectedChatModel}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          status={status}
          stop={handleStop}
        />
      </div>
    </section>
  );
}
