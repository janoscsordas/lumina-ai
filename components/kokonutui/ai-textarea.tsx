"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { ArrowUpCircle, Paperclip, Globe, Figma } from "lucide-react";
import { ChangeEvent } from "react";

export default function AITextarea({
    value,
    setValue,
    disabled,
    onSubmit,
}: {
    value: string;
    setValue: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    onSubmit?: () => void;
}) {
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 80,
        maxHeight: 200,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit form on Enter without Shift key
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default to avoid new line
            if (onSubmit && value.trim()) {
                onSubmit();
            }
        }
    };

    return (
        <div className="p-4 min-w-full">
            <div className="relative">
                <div className="relative flex flex-col border border-black/10 dark:border-white/10 rounded-xl">
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
                        />
                    </div>

                    <div className="h-14">
                        <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="p-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors rounded-lg border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors rounded-lg border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                                >
                                    <Globe className="w-4 h-4 text-blue-500" />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors rounded-lg border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                                >
                                    <Figma className="w-4 h-4 text-pink-500" />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={disabled}
                                className={cn(
                                    "p-2 transition-colors",
                                    value.trim()
                                        ? "text-lime-600 dark:text-lime hover:dark:text-lime-700 hover:text-lime-600"
                                        : "text-black/30 dark:text-white/30"
                                )}
                            >
                                <ArrowUpCircle className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
