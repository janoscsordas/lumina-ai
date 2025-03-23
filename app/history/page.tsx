import HistoryLoader from "@/components/history/history-loader";
import HistoryWrapper from "@/components/history/history-wrapper";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { getUserSession } from "@/lib/get-session"
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function History({ 
    searchParams 
}: { 
    searchParams: Promise<{ query?: string }> 
}) {
    const { query } = await searchParams;

    const session = await getUserSession();

    if (!session) {
        return redirect("/");
    }

    return (
        <main className="relative px-4 container mx-auto">
            <header className="py-4 mx-auto w-[95%] md:w-[80%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%]">
                <div className="flex items-center justify-between gap-4">
                    <Link href="/">
                        <Button variant="outline" className="cursor-pointer">
                            Go Back
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <UserAvatar user={session.user} />
                    </div>
                </div>
            </header>
            <section>
                <h1 className="text-3xl font-bold text-center">Your Chat History</h1>
                <p className="text text-gray-600 dark:text-gray-400 text-center">This is the history of your chat sessions</p>
                <div className="mt-8 mx-auto w-[95%] md:w-[80%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%]">
                    <Suspense fallback={
                        <HistoryLoader />
                    }>
                        <HistoryWrapper user={session.user} query={query} />
                    </Suspense>
                </div>
            </section>
        </main>
    )
}