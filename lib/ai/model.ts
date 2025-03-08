import { createOpenRouter } from "@openrouter/ai-sdk-provider";
 
const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
})

export const languageModel = openrouter("meta-llama/llama-3.3-70b-instruct:free");