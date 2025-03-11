import { memo } from "react";
import AITextarea from "../kokonutui/ai-textarea";

interface ChatInputProps {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  selectedChatModel: string | undefined;
  stop: () => void;
}

export const ChatInput = memo(
  ({
    input,
    handleInputChange,
    handleSubmit,
    status,
    selectedChatModel,
    stop,
  }: ChatInputProps) => {
    return (
      <form onSubmit={handleSubmit}>
        <AITextarea
          value={input}
          setValue={handleInputChange}
          disabled={status === "streaming" || status === "submitted"}
          onSubmit={handleSubmit}
          selectedChatModel={selectedChatModel}
          stop={stop}
        />
      </form>
    );
  }
);
ChatInput.displayName = "ChatInput";
