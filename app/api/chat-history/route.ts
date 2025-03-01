import { getLastTenChatHistory } from "@/lib/db/queries";
import { getUserSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatHistory = await getLastTenChatHistory({ userId: session.user.id });

    return NextResponse.json({ data: chatHistory || [] }, { status: 200 });
  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
