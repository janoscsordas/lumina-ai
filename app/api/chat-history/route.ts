import { Chat } from "@/database/schema/chat-schema";
import { getChatHistory } from "@/lib/db/queries";
import { getUserSession } from "@/lib/get-session";


export async function GET() {
    const session = await getUserSession();

    if (!session) {
        return new Response("You are not logged in!", { status: 401 });
    }

    const chatHistory = await getChatHistory({ userId: session.user.id });

    return new Response(JSON.stringify(chatHistory as Chat[]), { status: 200 });
}