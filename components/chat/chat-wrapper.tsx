import { convertToUIMessages } from "@/lib/utils";
import ChatComponent from "./chat-component";
import { getMessagesByChatId } from "@/lib/db/queries";
import { getChatModelFromCookie } from "@/actions/chat.action";

export default async function ChatWrapper({ id, isReadOnly }: { id: string, isReadOnly: boolean }) {
  const messagesFromDB = await getMessagesByChatId({
    id,
  });
  const chatModel = await getChatModelFromCookie();

  return (
    <ChatComponent
      id={id}
      initialMessages={convertToUIMessages(messagesFromDB)}
      selectedChatModel={chatModel}
      isReadOnly={isReadOnly}
    />
  );
}
