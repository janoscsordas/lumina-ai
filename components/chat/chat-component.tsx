"use client";

import AITextarea from "../kokonutui/ai-textarea";
import { ScrollArea } from "../ui/scroll-area";
import { useChat } from "@ai-sdk/react";

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, error, status } = useChat();

  return (
    <section className="w-full relative">
      <div className="flex flex-col w-2/3 h-full mx-auto">
        <ScrollArea className="h-1 flex-grow overflow-y-auto pt-6">
            {messages.map(m => (
                <div key={m.id} className="whitespace-pre-wrap">
                {m.role === 'user' ? 'User: ' : 'AI: '}
                {m.content}
                </div>
            ))}
        </ScrollArea>
        {error && (
            <div className="mt-2 text-red-500 text-sm w-max px-7 p-2">
                {error.message || 'An error occurred while processing your request.'}
            </div>
        )}
        <form onSubmit={handleSubmit}>
            <AITextarea value={input} setValue={handleInputChange} disabled={status === "streaming"} />
        </form>
      </div>
    </section>
  );
}
