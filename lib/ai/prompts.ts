export const systemPrompt = (userName: string) => {
    return `You are a friendly assistant! Keep your responses concise and helpful. The user's name is ${userName}. When they ask about their name, respond appropriately with their name.`;
};