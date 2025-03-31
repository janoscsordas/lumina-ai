'use server';

import { generateText, Message } from 'ai';
import { languageModel } from '@/lib/ai/model';
import { getUserSession } from '@/lib/get-session';
import { deleteChatHistoryQuery } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { aiModels } from '@/lib/ai/models';
import { db } from '@/database';
import { z } from 'zod';
import { chat } from '@/database/schema/chat-schema';
import { eq } from 'drizzle-orm';

export async function generateTitle({
    message
}: {
    message: Message;
}) {
    const chatModel = await getChatModelFromCookie();

    const { text: title } = await generateText({
        model: languageModel(chatModel || aiModels[0].id),
        system: `\n
            - you will generate a short title based on the first message a user begins a conversation with
            - ensure it is not more than 80 characters long
            - the title should be a summary of the user's message
            - do not use quotes, double quotes or colons`,
        prompt: JSON.stringify(message),
    })

    return title
}

export async function getChatModelFromCookie() {
    const cookieStore = await cookies();
    return cookieStore.get('chat-model')?.value;
}

export async function saveChatModelAsCookie(model: string) {
    const cookieStore = await cookies();

    const modelIsInModels = aiModels.map((m) => m.id).includes(model)

    if (modelIsInModels) {
        cookieStore.set('chat-model', model);
        return {
            success: true,
            error: null,
        }
    } else {
        return {
            success: false,
            error: 'Invalid model selected.',
        }
    }
}


/* 
    @params
    chatId: the id of the Chat the user wants to mark or unmark as favorite
    isFavorite: boolean, the actual value
*/
export async function changeFavoriteStatusForChat({ chatId, isFavorite }: { chatId: string, isFavorite: boolean }) {
    const session = await getUserSession();

    if (!session) {
        return {
            success: false,
            error: "Log in to make this chat a favorite"
        }
    }

    if (!z.object({ chatId: z.string(), isFavorite: z.boolean() }).safeParse({ chatId, isFavorite }).success) {
        console.error("The data sent by the user wasn't in a valid format")
        return {
            success: false,
            error: "Something bad happened while we tried to update your chat's status."
        }
    }

    try {
        await db.update(chat).set({
            isFavorite: !isFavorite
        }).where(eq(chat.id, chatId))
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Failed to change status of chat. Server error")
        return {
            success: false,
            error: "Failed to change status of chat. Server error"
        }
    }

    revalidatePath(`/chat/${chatId}`)
    return {
        success: true,
        message: "Message saved as a favorite."
    }
}

export async function shareChat({ chatId }: { chatId: string }) {
    const session = await getUserSession();

    if (!session) {
        return {
            success: false,
            error: "Log in to make this chat a favorite"
        }
    }

    if (!z.object({ chatId: z.string() }).safeParse({ chatId }).success) {
        console.error("Provided data was not in a valid format")
        return {
            success: false,
            error: "Internal server error."
        }
    }

    try {
        await db.update(chat).set({
            visibility: "public"
        }).where(eq(chat.id, chatId))
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Internal server error, while trying to change chat's visibility")
        return {
            success: false,
            error: "Internal server error 500"
        }
    }

    revalidatePath(`/chat/${chatId}`)
    return {
        success: true,
        message: "Successfully changed chat's visibility.",
        data: `${process.env.NEXT_PUBLIC_APP_URL}/chat/${chatId}`
    }
}

export async function deleteChatHistory({ userId }: { userId: string }) {
    try {
        const session = await getUserSession();

        if (!session || session.user.id !== userId) {
            throw new Error('Unauthorized');
        }

        await deleteChatHistoryQuery({ userId });
    } catch (error) {
        return {
            success: false,
            error: (error as Error).message,
        }
    }

    revalidatePath('/');
    return {
        success: true,
        error: null,
    }
}