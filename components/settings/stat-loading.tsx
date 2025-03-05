import { Loader2Icon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function StatLoading() {

    return (
        <div className="space-y-6">
            <Skeleton className="w-[28rem] h-[10rem] flex justify-center items-center">
                <Loader2Icon className="h-4 w-4 animate-spin" />
            </Skeleton>
            <Skeleton className="w-[28rem] h-[10rem] flex justify-center items-center">
                <Loader2Icon className="h-4 w-4 animate-spin" />
            </Skeleton>
        </div>
    )
}