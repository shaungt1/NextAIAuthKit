// src/app/(chat)/[id]/page.tsx
"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UsernameForm from "@/components/username-form";
import { notFound } from "next/navigation";
import useChatStore from "@/app/hooks/useChatStore";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Store UUID in local storage
  const [chatId, setChatId] = useLocalStorage("chatId", id);
  useEffect(() => {
    if (chatId !== id) {
      setChatId(id);
    }
  }, [id, chatId, setChatId]);

  const getChatById = useChatStore((state) => state.getChatById);
  const chat = getChatById(id);

  if (!chat) {
    return notFound();
  }

  const [open, setOpen] = useState(false);
  const userName = useChatStore((state) => state.userName);
  const setUserName = useChatStore((state) => state.setUserName);

  useEffect(() => {
    if (!userName) {
      setOpen(true);
    }
  }, [userName]);

  const onOpenChange = (isOpen: boolean) => {
    if (userName) {
      setOpen(isOpen);
    } else {
      setUserName("Anonymous");
      setOpen(isOpen);
    }
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <ChatLayout
        key={id}
        id={id}
        initialMessages={chat.messages}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Welcome to Ollama!</DialogTitle>
            <DialogDescription>
              Enter your name to get started. This is just to personalize your experience.
            </DialogDescription>
            <UsernameForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}