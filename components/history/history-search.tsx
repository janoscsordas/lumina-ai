"use client";

import { Input } from "@/components/ui/input";
import { useId } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function HistorySearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const id = useId();
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term.trim()) {
            params.set("query", term);
        }
        else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);


    return (
        <div className="*:not-first:mt-2 w-[90%] sm:w-[70%] mx-auto">
            <Input 
                id={id}  
                placeholder="Search..." 
                type="search" 
                onChange={(e) => handleSearch(e.target.value)} 
                defaultValue={searchParams.get('query')?.toString()} 
            />
        </div>
    )
}