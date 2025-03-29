import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import ChatWrapper from "@/components/chat/chat-wrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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

  const isReadOnly = chat.visibility === "public" && session?.user.id !== chat.userId

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <ChatWrapper id={chat.id} isReadOnly={isReadOnly} />
      </SidebarInset>
    </SidebarProvider>
  )
}
