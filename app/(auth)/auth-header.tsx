import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function AuthHeader() {

    return (
        <header className="fixed top-0 left-0 w-full border-b border-b-border bg-background px-5 py-3">
          <nav className="flex justify-between items-center gap-5">
            <Link href="/" className="font-bold text-lg hover:text-lime transition-colors duration-200">Lumina AI</Link>
            <ModeToggle />
          </nav>
        </header>
    )
}