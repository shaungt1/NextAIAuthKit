// filepath: c:\Users\Frontside\Documents\0.AI_LLM\NextAIAuthKit\src\app\localchat\layout.tsx
import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'LocalChat', // You can customize metadata here
    description: 'LocalChat GPT interface'
};

interface LocalChatLayoutProps {
    children: React.ReactNode; // Must accept children
}

export default function LocalChatLayout({ children }: LocalChatLayoutProps) {
    return (
        <>
            {/* Add any specific layout elements for /localchat here */}
            {/* e.g., <header>Local Chat Header</header> */}
            {children} {/* Render the actual page content */}
            {/* e.g., <footer>Local Chat Footer</footer> */}
        </>
    );
}
