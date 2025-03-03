import { generateTitle } from "@/actions/chat.action";
import { openrouter } from "@/lib/ai/model";
import { systemPrompt } from "@/lib/ai/prompts";
import { deleteChat, getAllChatHistory, getChatById, saveChat, saveMessages } from "@/lib/db/queries";
import { getUserSession } from "@/lib/get-session";
import { getMostRecentUserMessage, sanitizeResponseMessages } from "@/lib/utils";

import { createDataStreamResponse, streamText } from "ai";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET() {
  const session = await getUserSession();

  if (!session) {
    return NextResponse.json({ error: "You are not logged in."}, { status: 401 });
  }

  try {
    const chats = await getAllChatHistory({ userId: session.user.id });

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to get chats:", error);
    return NextResponse.json({ error: "Failed to get chats!" }, { status: 500 });
  }
}

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

export async function DELETE(request: Request) {
  const session = await getUserSession();

  if (!session) {
    return NextResponse.json("You are not logged in!", { status: 401 });
  }

  try {
    const { id } = await request.json();

    const chat = await getChatById({ id });

    if (!chat) {
      return new Response("Chat not found!", { status: 404 });
    }

    await deleteChat({ id });
  } catch (error: unknown) {
    console.error("Failed to delete chat:", error);
    return NextResponse.json({ error: "Failed to delete chat!" }, { status: 500 });
  }

  revalidatePath("/history");
  return NextResponse.json({ message: "Chat deleted successfully!" }, { status: 200 });
}