import { convertToUIMessages } from "@/lib/utils";
import ChatComponent from "./chat-component";
import { getMessagesByChatId } from "@/lib/db/queries";
import { getChatModelFromCookie } from "@/actions/chat.action";

export default async function ChatWrapper({ id }: { id: string }) {
  const messagesFromDB = await getMessagesByChatId({
    id,
  });
  const chatModel = await getChatModelFromCookie();

  return (
    <ChatComponent
      id={id}
      initialMessages={convertToUIMessages(messagesFromDB)}
      selectedChatModel={chatModel}
    />
  );
}
