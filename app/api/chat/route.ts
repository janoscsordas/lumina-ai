import { getUserSession } from '@/lib/get-session';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

export async function POST(request: Request) {
    const session = await getUserSession();

    if (!session) {
        return new Response('You are not logged in!', { status: 401 });
    }

    const { messages } = await request.json();

    try {
        const openrouter = createOpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY,
        })
    
        const result = streamText({
            model: openrouter("meta-llama/llama-3.3-70b-instruct:free"),
            messages,
        })
    
        return result.toDataStreamResponse();
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }
        return new Response('There was an error while trying to call the AI', { status: 500 });
    }
}