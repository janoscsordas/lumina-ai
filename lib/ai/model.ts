import { createOpenRouter } from "@openrouter/ai-sdk-provider";
 
const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
})

export function languageModel(modelId: string) {
    return openrouter(modelId);
}