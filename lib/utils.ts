import { CoreAssistantMessage, CoreToolMessage, Message } from "ai";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Message as DBMessage } from "@/database/schema/chat-schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMostRecentUserMessage(messages: Array<Message>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function sanitizeResponseMessages({
  messages,
  reasoning,
}: {
  messages: Array<ResponseMessage>;
  reasoning: string | undefined;
}) {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === 'tool') {
      for (const content of message.content) {
        if (content.type === 'tool-result') {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (typeof message.content === 'string') return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === 'tool-call'
        ? toolResultIds.includes(content.toolCallId)
        : content.type === 'text'
          ? content.text.length > 0
          : true,
    );

    if (reasoning) {
      // @ts-expect-error: reasoning message parts in sdk is wip
      sanitizedContent.push({ type: 'reasoning', reasoning });
    }

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}

export function generateUUID() {
  return crypto.randomUUID();
}


export function convertToUIMessages(
  messages: Array<DBMessage>,
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    let textContent = '';
    let reasoning: string | undefined = undefined;

    if (typeof message.content === 'string') {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      // Explicitly type the content to avoid type inference issues
      const contentArray = message.content as Array<{ type: string; text?: string; reasoning?: string }>;
      for (const content of contentArray) {
        if (content.type === 'text' && content.text) {
          textContent += content.text;
        } else if (content.type === 'reasoning' && content.reasoning) {
          reasoning = content.reasoning;
        }
      }
    }

    chatMessages.push({
      id: message.id,
      role: message.role as Message['role'],
      content: textContent,
      reasoning,
    });

    return chatMessages;
  }, []);
}