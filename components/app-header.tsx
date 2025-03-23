import { SidebarTrigger } from "./ui/sidebar";

export default function AppHeader() {

    return (
        <header className="flex h-[4.5rem] shrink-0 items-center gap-2 fixed z-50">
            <div className="flex items-center justify-between gap-2 px-3 w-full">
                <SidebarTrigger />
            </div>
        </header>
    )
}