import ChatComponent from "@/components/chat/chat-component";
import Sidebar from "@/components/sidebar";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { getUserSession } from "@/lib/get-session";
import { convertToUIMessages } from "@/lib/utils";
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

  const messagesFromDB = await getMessagesByChatId({
    id,
  })

  return (
    <main className="w-full min-h-screen flex gap-2">
      <Sidebar user={session ? session?.user : null} />
      <ChatComponent id={id} initialMessages={convertToUIMessages(messagesFromDB)} />
    </main>
  )
}
