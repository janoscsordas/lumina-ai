import ChatWrapper from "@/components/chat/chat-wrapper";
import Sidebar from "@/components/sidebar";
import { getChatById } from "@/lib/db/queries";
import { getUserSession } from "@/lib/get-session";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {  
  const params = await props.params;
  const { id } = params;

  const chat = await getChatById({ id });

  if (!chat) {
    return notFound();
  }

  const session = await getUserSession();

  if (chat.visibility === "private") {
    if (!session || !session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  return (
    <main className="w-full min-h-screen flex gap-2">
      <Sidebar user={session ? session?.user : null} currentChatId={chat.id} />
      <ChatWrapper id={chat.id} />
    </main>
  )
}
