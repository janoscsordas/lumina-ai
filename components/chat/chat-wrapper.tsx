import { convertToUIMessages } from "@/lib/utils";
import ChatComponent from "./chat-component";
import { getMessagesByChatId } from "@/lib/db/queries";

export default async function ChatWrapper({ id }: { id: string }) {
  const messagesFromDB = await getMessagesByChatId({
    id,
  });

  return (
    <ChatComponent
      id={id}
      initialMessages={convertToUIMessages(messagesFromDB)}
    />
  );
}
