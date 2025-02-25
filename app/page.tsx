import AITextarea from "@/components/kokonutui/ai-textarea";
import Sidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserSession } from "@/lib/get-session";

export default async function Home() {
  const session = await getUserSession();

  return (
    <main className="w-full min-h-screen flex gap-2">
      <Sidebar user={session ? session?.user : null} />
      <section className="w-full">
        <div className="flex flex-col w-2/3 h-full mx-auto">
          <ScrollArea className="flex-grow h-1 overflow-y-auto">

          </ScrollArea>
          <AITextarea />
        </div>
      </section>
    </main>
  );
}
