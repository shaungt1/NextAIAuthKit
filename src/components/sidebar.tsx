"use client";

import React from "react"; // Import React
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image"; // Keep if used by UserSettings or other parts
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // Keep if used by UserSettings
import UserSettings from "./user-settings"; // Assuming this exists and is used
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useChatStore from "@/app/hooks/useChatStore"; // Ensure path is correct

interface SidebarProps {
  isCollapsed: boolean;
  messages: Message[]; // Keep prop, might be used indirectly or by child components
  onClick?: () => void;
  isMobile: boolean;
  chatId: string; // ID of the currently active chat
  closeSidebar?: () => void;
}

export function Sidebar({
  messages,
  isCollapsed,
  isMobile,
  chatId,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter();
  const chats = useChatStore((state) => state.chats);
  const deleteChatById = useChatStore((state) => state.deleteChat);

  const handleNewChatClick = () => {
    console.log("Navigating to /localchat for new chat...");
    router.push("/localchat");
    if (closeSidebar) {
      closeSidebar();
    }
  };

  const handleDeleteChat = (idToDelete: string) => {
    console.log(`Attempting to delete chat: ${idToDelete}`);
    if (deleteChatById) {
      deleteChatById(idToDelete);
      console.log(`Deleted chat ${idToDelete} from store.`);
    } else {
      console.error("deleteChat function not found in useChatStore");
      return;
    }

    if (idToDelete === chatId) {
      console.log(`Deleted active chat ${idToDelete}, navigating to /localchat...`);
      router.push("/localchat");
    }
  };

  const getChatName = (chatData: any): string => {
    if (chatData?.messages?.length > 0) {
      const firstUserMessage = chatData.messages.find((m: Message) => m.role === 'user');
      const content = firstUserMessage?.content || chatData.messages[0]?.content || '';
      return content.substring(0, 30) + (content.length > 30 ? '...' : '');
    }
    return 'New Chat';
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        {/* --- New Chat Button --- */}
        <Button
          onClick={handleNewChatClick}
          variant="ghost"
          className="flex justify-start w-full h-14 text-sm xl:text-lg font-normal items-center gap-3"
        >
          <SquarePen size={18} className="shrink-0 w-4 h-4" />
          {(!isCollapsed || isMobile) && <span>New chat</span>}
        </Button>

        {/* --- Chat List --- */}
        <div className="flex flex-col pt-10 gap-2">
          {(!isCollapsed || isMobile) && <p className="pl-4 text-xs text-muted-foreground">Your chats</p>}
          {chats && Object.keys(chats).length > 0 ? (
            Object.entries(chats)
              .sort(
                ([, a], [, b]) =>
                  (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
                  (a.createdAt ? new Date(a.createdAt).getTime() : 0)
              )
              .map(([id, chatData]) => (
                <Link
                  key={id}
                  href={`/localchat/${id}`}
                  onClick={() => {
                    console.log(`Clicked link to chat: /localchat/${id}`);
                    if (closeSidebar) closeSidebar();
                  }}
                  className={cn(
                    buttonVariants({ variant: id === chatId ? "secondaryLink" : "ghost", size: "lg" }),
                    "flex justify-between w-full h-14 text-sm font-normal items-center group/chatlink"
                  )}
                  title={getChatName(chatData)}
                >
                  {/* Chat Name (conditional) */}
                  {(!isCollapsed || isMobile) && (
                    <span className="flex-grow truncate pr-2">
                      {getChatName(chatData)}
                    </span>
                  )}

                  {/* --- Options Menu (Delete) --- */}
                  {(!isCollapsed || isMobile) && id === chatId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {/* This Button is the single child for DropdownMenuTrigger */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 opacity-0 group-hover/chatlink:opacity-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal size={15} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <Dialog>
                          <DialogTrigger asChild>
                            {/* This DropdownMenuItem is the single child for DialogTrigger */}
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/50 cursor-pointer"
                              onSelect={(e) => e.preventDefault()} // Prevent menu closing immediately
                            >
                              {/* Content inside the item */}
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete chat
                            </DropdownMenuItem>
                          </DialogTrigger>
                          {/* --- Delete Confirmation Dialog --- */}
                          <DialogContent>
                            <DialogHeader className="space-y-4">
                              <DialogTitle>Delete chat?</DialogTitle>
                              <DialogDescription>
                                Are you sure? This cannot be undone.
                              </DialogDescription>
                              <div className="flex justify-end gap-2">
                                <DialogClose asChild>
                                  {/* This Button is the single child for DialogClose */}
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChat(id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </Link>
              ))
          ) : (
            (!isCollapsed || isMobile) && <p className="pl-4 text-xs text-muted-foreground">No chats yet.</p>
          )}
        </div>
      </div>

      {/* --- Bottom Section (User Settings) --- */}
      <div className={cn("justify-end px-2 py-2 w-full border-t mt-auto")}>
        <UserSettings isCollapsed={isCollapsed && !isMobile} />
      </div>
    </div>
  );
}