import HistoryWrapper from "@/components/history/history-wrapper";
import { ModeToggle } from "@/components/mode-toggle";
import { TextShimmer } from "@/components/ui/text-shimmer";
import UserAvatar from "@/components/user-avatar";
import { getUserSession } from "@/lib/get-session"
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function History() {
    const session = await getUserSession();

    if (!session) {
        return redirect("/");
    }

    return (
        <main className="relative py-16 px-4">
            <header className="fixed top-0 left-0 w-full flex justify-between items-center py-2 px-4 border-b border-black/10 dark:border-white/10">
                <div className="flex gap-4 items-center">
                    <Link href="/" className="font-bold text-lime-500 dark:text-lime hover:text-lime-600">Lumina AI</Link>
                    <TextShimmer className="font-mono font-semibold" duration={3}>Chat History</TextShimmer>
                </div>
                <div className="flex gap-4 items-center">
                    <ModeToggle />
                    <UserAvatar user={session.user} />
                </div>
            </header>
            <section className="py-16">
                <h1 className="text-3xl font-bold text-center">Your Chat History</h1>
                <p className="text text-gray-600 dark:text-gray-400 text-center">This is the history of your chat sessions</p>
                <div className="mt-8 mx-auto w-[95%] md:w-[80%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%]">
                    <Suspense fallback={<TextShimmer className="font-mono justify-start" duration={1}>Loading...</TextShimmer>}>
                        <HistoryWrapper user={session.user} />
                    </Suspense>
                </div>
            </section>
        </main>
    )
}