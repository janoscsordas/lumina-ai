"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Message, useChat } from "@ai-sdk/react";
import { TextShimmer } from "../ui/text-shimmer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChatMessage } from "../ui/chat-message";
import { useCallback, useRef } from "react";
import { ChatInput } from "./chat-input";
import { CopyButton } from "../ui/copy-button";
import LikeButton from "./like-button";
import { Vote } from "@/database/schema/chat-schema";
import { PromptSuggestions } from "../ui/prompt-suggestions";

export default function ChatComponent({
  id,
  initialMessages,
  selectedChatModel,
  isReadOnly
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string | undefined;
  isReadOnly: boolean
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const bottomDivRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    setInput,
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

      if (bottomDivRef.current) {
        bottomDivRef.current.scrollIntoView();
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: votes } = useQuery({
    queryKey: ["votes"],
    queryFn: async () => {
      if (!initialMessages.length) {
        return []
      }

      const response = await fetch(`/api/vote?chatId=${id}`)

      if (!response.ok) {
        throw new Error("Error fetching votes")
      }

      const data = await response.json()

      return data.data as Vote[]
    },
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  })

  const handleStop = useCallback(() => {
    if (typeof stop === 'function') {
      stop();
    }
  }, [stop]);

  const append = (message: { role: "user", content: string }) => {
    setInput(message.content)
  }

  return (
    <section className="w-[98%] relative">
      <div className="flex flex-col w-[98%] md:w-[95%] 2xl:w-2/3 min-h-screen mx-auto pt-2">
        <ScrollArea className="h-1 flex-grow flex flex-col-reverse px-4 py-2 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground dark:[&::-webkit-scrollbar-track]:bg-transparent">
          {(!initialMessages.length && !messages.length) && (
            <div className="w-full h-full flex justify-center items-center">
              <PromptSuggestions 
                label="How can I help you today?"
                append={append}
                suggestions={[
                  "Can you suggest a good book to read?",
                  "What's a good hobby to start?",
                  "How does AI work?"
                ]}
              /> 
            </div>
          )}
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              id={m.id}
              content={m.content}
              role={m.role}
              className="my-2"
              actions={
                !isReadOnly && (
                  <>
                    <div className="border-r pr-1">
                      <CopyButton
                        content={m.content}
                        copyMessage="Copied response to clipboard!"
                      />
                    </div>
                    <LikeButton chatId={id} messageId={m.id} isUpvoted={votes ? votes.find((vote) => vote.messageId === m.id)?.isUpVoted : null} />
                  </>
                )
              }
            />
          ))}
          {status === "submitted" && (
            <TextShimmer className="font-mono font-medium justify-start text-sm ml-3 mt-3" duration={1}>
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
        {isReadOnly ? (
          <div className="w-full h-16 flex justify-center items-center">
            <div className="rounded-lg px-4 py-4 border border-border">
              <p>You see this chat in read-only mode.</p>
            </div>
          </div>
        ) : (
          <ChatInput
            selectedChatModel={selectedChatModel}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            status={status}
            stop={handleStop}
          />
        )}
      </div>
    </section>
  );
}
