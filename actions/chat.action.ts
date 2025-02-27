'use server';

import { generateText, Message } from 'ai';
import { openrouter } from '@/lib/ai/model';

export async function generateTitle({
    message
}: {
    message: Message;
}) {
    const { text: title } = await generateText({
        model: openrouter("meta-llama/llama-3.3-70b-instruct:free"),
        system: `\n
            - you will generate a short title based on the first message a user begins a conversation with
            - ensure it is not more than 80 characters long
            - the title should be a summary of the user's message
            - do not use quotes or colons`,
        prompt: JSON.stringify(message),
    })

    return title
}