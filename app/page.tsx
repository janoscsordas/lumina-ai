import { getChatModelFromCookie } from "@/actions/chat.action";
import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import ChatComponent from "@/components/chat/chat-component";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { generateUUID } from "@/lib/utils";

export default async function Home() {
  const id = generateUUID();
  const chatModel = await getChatModelFromCookie();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <ChatComponent id={id} initialMessages={[]} selectedChatModel={chatModel} />
      </SidebarInset>
    </SidebarProvider>
  );
}
