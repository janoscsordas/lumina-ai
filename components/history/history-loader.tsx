import { Skeleton } from "../ui/skeleton";


export default function HistoryLoader() {

    return (
        <div>
            <div className="*:not-first:mt-2 w-[90%] sm:w-[70%] mx-auto">
                <Skeleton className="w-full h-8" />
            </div>
            <div className="w-full p-4 mx-auto">
                <Skeleton className="w-full h-20 my-3" />
                <Skeleton className="w-full h-20 my-3" />
            </div>
        </div>
    )
}