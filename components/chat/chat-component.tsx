"use client";

import AITextarea from "../kokonutui/ai-textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Message, useChat } from "@ai-sdk/react";
import { TextShimmer } from "../ui/text-shimmer";

export default function ChatComponent({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const { messages, input, handleInputChange, handleSubmit, error, status } =
    useChat({
      id, 
      initialMessages,
    });

  return (
    <section className="w-full relative">
      <div className="flex flex-col w-2/3 h-full mx-auto">
        <ScrollArea className="h-1 flex-grow overflow-y-auto pt-6 flex flex-col gap-2">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))}
          {status === "submitted" && (
            <TextShimmer className="font-mono text-sm justify-start" duration={1}>Thinking...</TextShimmer>
          )}
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
