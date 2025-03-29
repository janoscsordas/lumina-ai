import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {

    return (
        <div className="w-full min-h-svh py-16 flex flex-col gap-1 justify-center items-center">
            <h1 className="text-4xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-muted-foreground">Page not found.</h2>
            <Link href="/">
                <Button variant="outline">
                        Go Home
                </Button>
            </Link>
        </div>
    )
}