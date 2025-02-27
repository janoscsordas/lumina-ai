import { generateTitle } from "@/actions/chat.action";
import { openrouter } from "@/lib/ai/model";
import { systemPrompt } from "@/lib/ai/prompts";
import { getChatById, saveChat, saveMessages } from "@/lib/db/queries";
import { getUserSession } from "@/lib/get-session";
import { getMostRecentUserMessage, sanitizeResponseMessages } from "@/lib/utils";

import { createDataStreamResponse, streamText } from "ai";

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await getUserSession();

  if (!session) {
    return new Response("You are not logged in!", { status: 401 });
  }

  const { id, messages } = await request.json();

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response("No messages in the chat!", { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitle({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  await saveMessages({
    messages: [
      { ...userMessage, createdAt: new Date().toISOString(), chatId: id },
    ],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: openrouter("meta-llama/llama-3.3-70b-instruct:free"),
        system: systemPrompt(),
        messages,
        maxSteps: 5,
        onFinish: async ({ response, reasoning }) => {
          if (session.user?.id) {
            try {
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning,
              });

              await saveMessages({
                messages: sanitizedResponseMessages.map((message) => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content as string,
                    createdAt: new Date().toISOString(),
                  };
                }),
              });
            } catch (error) {
              console.error("Failed to save chat:", error);
            }
          }
        },
      });

      result.consumeStream();

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: (error) => {
      console.error("Stream error:", error);
      return "An error occurred while processing your request. Please try again.";
    },
  });
}
