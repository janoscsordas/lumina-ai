import { auth } from "@/auth";
import { headers } from "next/headers";

// Get the currently logged in user's session.
export async function getUserSession() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        return session || null;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        }
        return null;
    }
}