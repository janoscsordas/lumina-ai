
import { saveChatModelAsCookie } from "@/actions/chat.action";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { aiModels } from "@/lib/ai/models";
import toast from "react-hot-toast";

export default function ModelSelector({ selectedChatModel, disabled }: { selectedChatModel: string | undefined, disabled: boolean | undefined }) {
    const handleModelChange = async (modelId: string) => {
        const { success, error } = await saveChatModelAsCookie(modelId);

        if (!success) {
            toast.error(error);
        }
    }

    return (
        <Select onValueChange={handleModelChange} value={selectedChatModel || aiModels[0].id} disabled={disabled}>
            <SelectTrigger>
                <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>AI Models</SelectLabel>
                {aiModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                    {model.name}
                    </SelectItem>
                ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}