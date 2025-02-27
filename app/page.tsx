import ChatComponent from "@/components/chat/chat-component";
import Sidebar from "@/components/sidebar";
import { getUserSession } from "@/lib/get-session";
import { generateUUID } from "@/lib/utils";

export default async function Home() {
  const session = await getUserSession();
  const id = generateUUID();

  return (
    <main className="w-full min-h-screen flex gap-2">
      <Sidebar user={session ? session?.user : null} />
      <ChatComponent id={id} initialMessages={[]} />
    </main>
  );
}
