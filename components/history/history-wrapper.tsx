import { getAllChatHistory } from "@/lib/db/queries"
import { User } from "better-auth"
import HistorySearch from "./history-search"

export default async function historyWrapper({ user }: { user: User }) {
    const chatHistory = await getAllChatHistory({ userId: user.id })

    return (
        <div>
            <HistorySearch />
        </div>
    )
}