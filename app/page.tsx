import { getChatModelFromCookie } from "@/actions/chat.action";
import ChatComponent from "@/components/chat/chat-component";
import MobileNavbar from "@/components/mobile-navbar";
import Sidebar from "@/components/sidebar";
import { getUserSession } from "@/lib/get-session";
import { generateUUID } from "@/lib/utils";

export default async function Home() {
  const session = await getUserSession();
  const id = generateUUID();
  const chatModel = await getChatModelFromCookie();

  return (
    <main className="w-full min-h-screen flex gap-2">
      <MobileNavbar user={session ? session?.user : null} />
      <Sidebar user={session ? session?.user : null} />
      <ChatComponent id={id} initialMessages={[]} selectedChatModel={chatModel} />
    </main>
  );
}
