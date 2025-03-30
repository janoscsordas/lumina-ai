"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { ArrowUpCircle, CircleStop } from "lucide-react";
import { ChangeEvent } from "react";
import ModelSelector from "../chat/model-selector";

export default function AITextarea({
  value,
  setValue,
  disabled,
  onSubmit,
  selectedChatModel,
  stop,
}: {
  value: string;
  setValue: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  onSubmit?: () => void;
  selectedChatModel: string | undefined;
  stop: () => void;
}) {

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 80,
    maxHeight: 200,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit form on Enter without Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      if (onSubmit && value.trim()) {
        onSubmit();
        adjustHeight(true);
      }
    }
  };

  return (
    <div className="p-4 min-w-full">
      <div className="relative">
        <div className="relative flex flex-col border border-border rounded-xl">
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className={cn(
                "w-full px-4 py-3",
                "resize-none",
                "bg-transparent",
                "border-none",
                "focus:outline-hidden",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-black/50 dark:placeholder:text-white/50",
                "align-top leading-normal",
                "min-h-[80px]"
              )}
              style={{
                overflow: "hidden",
                outline: "none",
              }}
              disabled={disabled}
              autoFocus
            />
          </div>

          <div className="h-14">
            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ModelSelector selectedChatModel={selectedChatModel} disabled={disabled} />
              </div>
              {disabled ? (
                <button 
                    type="button"
                    onClick={() => stop()}
                    className={cn(
                        "p-2 transition-colors cursor-pointer",
                        "text-red-600 dark:text-red hover:dark:text-red-700 hover:text-red-600"
                    )}
                >
                    <CircleStop className="w-6 h-6" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={disabled}
                  className={cn(
                    "p-2 transition-colors",
                    value.trim()
                      ? "text-primary-foreground"
                      : "text-black/30 dark:text-white/30"
                  )}
                >
                  <ArrowUpCircle className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
