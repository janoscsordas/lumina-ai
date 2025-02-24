import { auth } from "@/auth";
import { headers } from "next/headers";

// Get the currently logged in user's session.
export async function getUserSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return null
    }

    return session
}