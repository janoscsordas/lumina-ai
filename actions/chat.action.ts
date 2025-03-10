'use server';

import { generateText, Message } from 'ai';
import { languageModel } from '@/lib/ai/model';
import { getUserSession } from '@/lib/get-session';
import { deleteChatHistoryQuery } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { aiModels } from '@/lib/ai/models';

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
            - do not use quotes or colons`,
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

    if (aiModels.map((m) => m.id).includes(model)) {
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