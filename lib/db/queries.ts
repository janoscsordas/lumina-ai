"use server";

import { db } from "@/database";
import { Chat, chat, message, Message } from "@/database/schema/chat-schema";
import { and, desc, eq, sql } from "drizzle-orm";

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));

    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    const selectedMessages = await db
      .select()
      .from(message)
      .where(eq(message.chatId, id));

    return selectedMessages;
  } catch (error) {
    console.error("Failed to get messages by chat id from database");
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    await db.insert(chat).values({
      id,
      userId,
      title,
    });
  } catch (error) {
    console.error("Failed to save chat to database");
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error("Failed to save messages in database", error);
    throw error;
  }
}

export async function getLastTenChatHistory({ userId }: { userId: string }) {
  try {
    const chats = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, userId))
      .orderBy(desc(chat.createdAt))
      .limit(10);

    return chats;
  } catch (error) {
    console.error("Failed to get chat history from database");
    throw error;
  }
}

export async function getAllChatHistory({ userId, query }: { userId: string, query?: string }) {
  try {
    if (!query || query.trim() === "") {
      return await db
        .select()
        .from(chat)
        .where(eq(chat.userId, userId))
        .orderBy(desc(chat.createdAt));
    }

    const chats = await db
      .select()
      .from(chat)
      .where(and(
        eq(chat.userId, userId),
        sql`lower(${chat.title}) LIKE lower(${'%' + query + '%'})`
      ))
      .orderBy(desc(chat.createdAt));

    return chats;
  } catch (error) {
    console.error("Failed to get chat history from database", error);
    return ([] as Chat[]);
  }
}

export async function deleteChat({ id }: { id: string }) {
  try {
    await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat from database", error);
    throw error;
  }
}