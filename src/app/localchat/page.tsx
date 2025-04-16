'use client'; // Needs to be client-side for useRouter and sessionStorage

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/lib/utils'; // Use your existing UUID utility

// Key for storing the current chat ID in session storage for this session
const SESSION_STORAGE_CURRENT_CHAT_ID_KEY = 'currentLocalChatId';

export default function LocalChatRedirector() {
    const router = useRouter();

    useEffect(() => {
        // This effect runs once when the component mounts on the client
        if (typeof window !== 'undefined') {
            // 1. Generate a new UUID for the new chat session using your utility
            const id = generateUUID();

            // 2. Store the newly generated UUID in Session Storage
            try {
                // sessionStorage is specific to the browser tab/window session
                sessionStorage.setItem(SESSION_STORAGE_CURRENT_CHAT_ID_KEY, id);
                // Log the ID being stored for debugging purposes
                console.log(`Stored new chat ID in sessionStorage: ${id}`);
            } catch (error) {
                console.error("Failed to update sessionStorage:", error);
                // Decide how to handle storage errors (e.g., continue without storing)
            }

            // 3. Redirect to the dynamic chat page with the new ID
            // Using replace avoids adding /localchat itself to the browser history
            router.replace(`/localchat/${id}`);
        }
    }, [router]); // Dependency array ensures effect runs once on mount

    // Render nothing or a loading indicator while redirecting
    return null; // Or a loading spinner component
}