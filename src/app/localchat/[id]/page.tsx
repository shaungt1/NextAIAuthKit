"use client"; // Keep as client component if using hooks like useChatStore directly

import { ChatLayout } from "@/components/chat/chat-layout";
import React from "react"; // Import React
import { notFound } from "next/navigation";
import useChatStore from "@/app/hooks/useChatStore"; // Ensure path is correct

// Define the expected shape of the params object *after* unwrapping
interface ResolvedParams {
    id: string;
}

// Define the props type for the Page component, accepting the potentially promised params
interface PageProps {
    params: Promise<ResolvedParams> | ResolvedParams; // params can be a Promise or the resolved object
}

export default function Page({ params }: PageProps) {
  // Use React.use() to unwrap the params promise if it is one.
  // If params is already the resolved object, React.use() will just return it.
  const resolvedParams = React.use(params);
  const id = resolvedParams.id; // Get the chat ID from the resolved params

  const getChatById = useChatStore((state) => state.getChatById);
  // Attempt to retrieve the chat data from the store.
  const chat = getChatById(id);

  // Optional: Validate if the ID is in the tracked list in localStorage.
  // React.useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const storedIdsRaw = localStorage.getItem('localChatIds'); // Assuming you might add this back
  //     const chatIds: string[] = storedIdsRaw ? JSON.parse(storedIdsRaw) : [];
  //     if (!chatIds.includes(id)) {
  //        console.warn(`Attempted to access chat ID ${id} which is not in the tracked list.`);
  //        // Handle invalid ID if necessary (e.g., redirect)
  //        // import { useRouter } from 'next/navigation';
  //        // const router = useRouter();
  //        // router.replace('/localchat');
  //     }
  //   }
  // }, [id]); // Run check when id changes

  // Note: If getChatById *always* returns a chat object (even an empty one
  // for a new ID, created on demand in the store), you might not need the `chat?.messages || []` fallback.
  // The current approach is safer if getChatById can return undefined for new IDs.

  // Render the ChatLayout component
  return (
    <main className="flex mt-20 h-[calc(100dvh)] flex-col items-center ">
      <ChatLayout
        key={id} // Use the chat ID as the key for proper re-renders on ID change
        id={id}   // Pass the chat ID using the correct 'id' prop
        // Pass initial messages if the chat exists in the store, otherwise pass empty array for a new chat
        initialMessages={chat?.messages || []}
        navCollapsedSize={10} // Pass other required props for ChatLayout
        defaultLayout={[30, 160]} // Pass other required props for ChatLayout
      />
    </main>
  );
}