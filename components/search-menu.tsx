import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Chat } from "@/database/schema/chat-schema";
import Link from "next/link";
import { TextShimmer } from "./ui/text-shimmer";

export default function SearchMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["chat-search"],
    queryFn: async () => {
      const response = await fetch("/api/chat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const { chats }: { chats: Chat[] } = await response.json();

      return chats;
    },
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: true,
    staleTime: 0,
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search in a chat..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Search Results">
          {error && <CommandItem><span className="text-red-500">{error.message}</span></CommandItem>}
          {isLoading && (
            <CommandItem>
              <TextShimmer>Loading...</TextShimmer>
            </CommandItem>
          )}
          {data &&
            data.map((chat) => (
              <Link href={`/chat/${chat.id}`} key={chat.id}>
                <CommandItem>{chat.title}</CommandItem>
              </Link>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
