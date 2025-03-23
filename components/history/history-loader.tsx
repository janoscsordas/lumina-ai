import { Skeleton } from "../ui/skeleton";


export default function HistoryLoader() {

    return (
        <div>
            <div className="*:not-first:mt-2 w-[90%] sm:w-[70%] mx-auto">
                <Skeleton className="w-full h-8" />
            </div>
            <div className="w-full p-4 mx-auto grid grid-cols-1 gap-x-4 md:grid-cols-2 place-items-center">
                <Skeleton className="w-full h-20 my-1" />
                <Skeleton className="w-full h-20 my-1" />
                <Skeleton className="w-full h-20 my-1" />
                <Skeleton className="w-full h-20 my-1" />
            </div>
        </div>
    )
}