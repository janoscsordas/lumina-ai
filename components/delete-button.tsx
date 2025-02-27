import { Trash2Icon } from "lucide-react"

export default function DeleteButton({
    chatId
}: {
    chatId: string
}) {

    return (
        <button className="absolute top-1/2 right-0 cursor-pointer transform -translate-y-1/2 translate-x-10 flex items-center justify-center text-red-500 hover:text-red-400 rounded-md p-2 group-hover:-translate-y-1/2 group-hover:-translate-x-0 transition-transform duration-150">
            <Trash2Icon className="w-4 h-4" />
        </button>
    )
}