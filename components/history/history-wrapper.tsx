import { getAllChatHistory } from "@/lib/db/queries"
import { User } from "better-auth"
import HistorySearch from "./history-search"
import HistoryList from "./history-list"

export default async function historyWrapper({ user, query }: { user: User, query?: string }) {
    const chatHistory = await getAllChatHistory({ userId: user.id, query });

    return (
        <div>
            <HistorySearch />
            <HistoryList chatHistory={chatHistory} />
        </div>
    )
}