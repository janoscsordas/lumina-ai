import { memo } from "react";
import AITextarea from "../kokonutui/ai-textarea";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: () => void;
    status: "submitted" | "streaming" | "ready" | "error";
}

export const ChatInput = memo(({ input, handleInputChange, handleSubmit, status }: ChatInputProps) => {
    return (
        <form onSubmit={handleSubmit}>
          <AITextarea
            value={input}
            setValue={handleInputChange}
            disabled={status === "streaming"}
            onSubmit={handleSubmit}
          />
        </form>
    )
})
ChatInput.displayName = "ChatInput";