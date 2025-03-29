import { db } from "@/database";
import { vote } from "@/database/schema/chat-schema";
import { getUserSession } from "@/lib/get-session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
    const session = await getUserSession();

    if (!session) {
        return NextResponse.json({ error: "Log in to get votes" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    
    if (!chatId) {
        return NextResponse.json({ error: "Failed to get votes" }, { status: 500 })
    }

    try {
        const chatSpecificVotes = await db.select().from(vote).where(eq(vote.chatId, chatId))
        return NextResponse.json({ data: chatSpecificVotes }, { status: 200 })
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Failed to fetch votes")
        return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = await getUserSession();

    if (!session) {
        return NextResponse.json({ error: "Please log in to upvote messages" }, { status: 401 })
    }

    const { chatId, messageId, isUpvote } = await request.json()

    try {
        const validatedFields = z.object({ chatId: z.string(), messageId: z.string(), isUpvote: z.boolean() }).safeParse({ chatId, messageId, isUpvote });

        if (!validatedFields.success) {
            throw new Error("Wrong data given")
        }

        await db.insert(vote).values({
            chatId: validatedFields.data.chatId,
            messageId: validatedFields.data.messageId,
            isUpVoted: validatedFields.data.isUpvote
        })
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "There was an error while the user tried to upvote a message")
        return NextResponse.json({ error: "Server error. Failed to upvote message" })
    }

    revalidatePath(`/chat/${chatId}`)
    return NextResponse.json({ message: "Successfully upvoted message" }, { status: 201 })
}