'use client';

// This remains a Client Component
import React from 'react';

import { ChatLayout } from '@/components/chat/chat-layout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UsernameForm from '@/components/username-form';

// Assuming useChatStore is correctly set up for state management
import useChatStore from '../hooks/useChatStore';

// Ensure this path is correct

// Define the props for the LocalChat component
interface LocalChatProps {
    params: {
        id: string; // Expecting the chat ID from the parent page component
    };
}

export default function LocalChat({ params }: LocalChatProps) {
    const { id } = params; // Extract the id passed from the page component
    const [open, setOpen] = React.useState(false); // State for the username dialog

    // Zustand state for username
    const userName = useChatStore((state) => state.userName);
    const setUserName = useChatStore((state) => state.setUserName);

    // Handler for dialog open/close state changes
    const onOpenChange = (isOpen: boolean) => {
        // If a username is already set, allow normal dialog closing
        if (userName) {
            setOpen(isOpen);
            return;
        }
        // If no username, set a default and keep dialog open logic (or adjust as needed)
        // This part might need review based on desired UX when closing without entering a name
        if (!isOpen && !userName) {
            // Example: Set a default if closed without entering name
            // setUserName('Anonymous');
        }
        setOpen(isOpen);
    };

    // Effect to potentially open the dialog if no username is set when component mounts
    React.useEffect(() => {
        if (!userName) {
            setOpen(true);
        }
        // Add dependency array if needed, e.g., [userName]
    }, [userName]);

    return (
        <main className='flex mt-16 h-[calc(100dvh)] flex-col items-center'>
            {/* Dialog for username input */}
            <Dialog open={open} onOpenChange={onOpenChange}>
                {/* The main chat layout component */}
                {/* Pass the unique chat ID (id) and potentially use it within ChatLayout */}
                {/* The key={id} ensures React treats navigations between different chat IDs */}
                {/* as distinct component instances if needed. */}
                <ChatLayout
                    key={id} // Use id as key for potential re-mounting on ID change
                    id={id} // Pass the required id prop
                    initialMessages={[]} // Pass initial messages if needed
                    navCollapsedSize={10}
                    defaultLayout={[30, 160]}
                />
                {/* Dialog content for username */}
                <DialogContent className='flex flex-col space-y-4'>
                    <DialogHeader className='space-y-2'>
                        <DialogTitle>Welcome to Local Chat!</DialogTitle>
                        <DialogDescription>Enter your name to get started. This is optional.</DialogDescription>
                        {/* Form component to set the username */}
                        <UsernameForm setOpen={setOpen} />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </main>
    );
}
