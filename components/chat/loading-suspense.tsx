import { Skeleton } from "../ui/skeleton";
import { TextShimmer } from "../ui/text-shimmer";


export default function LoadingSuspense() {

    return (
        <section className="w-full flex items-center">
            <Skeleton className="w-2/3 h-[calc(100dvh-2rem)] mx-auto flex justify-center items-center">
                <TextShimmer duration={1} className="text-xl">
                    Loading your conversation...
                </TextShimmer>
            </Skeleton>
        </section>
    )
}