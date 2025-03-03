"use client";

import AITextarea from "../kokonutui/ai-textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Message, useChat } from "@ai-sdk/react";
import { TextShimmer } from "../ui/text-shimmer";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChatMessage } from "../ui/chat-message";
import { useEffect, useRef } from "react";

export default function ChatComponent({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const bottomDivRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, error, status } =
    useChat({
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

  useEffect(() => {
    if (bottomDivRef.current) {
      bottomDivRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <section className="w-full relative">
      <div className="flex flex-col w-[95%] 2xl:w-2/3 h-full mx-auto">
        <ScrollArea className="relative h-1 flex-grow overflow-y-auto pt-6 flex flex-col gap-8 px-4">
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              id={m.id}
              content={m.content}
              role={m.role}
              className="my-3"
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
        <form onSubmit={handleSubmit}>
          <AITextarea
            value={input}
            setValue={handleInputChange}
            disabled={status === "streaming"}
          />
        </form>
      </div>
    </section>
  );
}
