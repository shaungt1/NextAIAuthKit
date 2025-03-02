
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Separator } from '@/registry/new-york/ui/separator';

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

interface AIChatWindowProps {
    modelName?: string;
    systemPrompt?: string;
    temperature?: number;
    maxLength?: number;
    topP?: number;
    frequencyPenalty?: number;
    stream?: boolean;
}

export default function AIChatWindow({
    modelName = 'gpt-4o',
    systemPrompt = 'You are an AI assistant',
    temperature = 0.7,
    maxLength = 256,
    topP = 0.9,
    frequencyPenalty = 0,
    stream = true,
}: AIChatWindowProps) {
    const { data: session } = useSession();
    const [conversationId, setConversationId] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 🔹 Define inactivity timeout (1 min 15 sec) from environment variable
    const INACTIVITY_TIMEOUT = Number(process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT) || 75000;
    let inactivityTimer: NodeJS.Timeout | null = null;

    useEffect(() => {
        // Auto-scroll to the bottom when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        async function initializeConversation() {
            if (!session?.user) {
                console.warn("🔹 User is not logged in. Using test conversation ID.");
                const testConversationId = uuidv4();
                setConversationId(testConversationId);
                sessionStorage.setItem("conversationId", testConversationId);
                return;
            }

            const storedConversationId = sessionStorage.getItem("conversationId");

            if (storedConversationId) {
                console.log("✅ Using existing conversation ID:", storedConversationId);
                setConversationId(storedConversationId);
                return;
            }

            // Generate a new conversation ID if none exists
            console.log("🚀 Starting new conversation...");
            const newConversationId = uuidv4();
            setConversationId(newConversationId);
            sessionStorage.setItem("conversationId", newConversationId);
        }

        initializeConversation();
        resetInactivityTimer();

        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
        };
    }, [session]);

    // 🔹 Reset inactivity timer on user action
    const resetInactivityTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(endChat, INACTIVITY_TIMEOUT);
    };




    // 🔹 Save conversation and clear session storage when chat ends
    const endChat = async () => {
        if (!conversationId || !session?.user?.id) return;
    
        console.log("⏳ Ending chat and saving...");
    
        // 🔹 Make sure we capture the latest messages before clearing state
        const latestMessages = [...messages];
    
        // Structure conversation data with full history
        const conversationData = JSON.stringify(latestMessages);
        const payload = {
            conversationId,
            userId: session.user.id,
            conversationData
        };
    
        console.log("📜 SAVING CONVERSATION DATA:", payload);
    
        try {
            // ✅ Ensure conversation is fully saved before clearing state
            const response = await fetch('/api/conversations/save-conversation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) throw new Error("⚠️ Failed to save conversation");
    
            console.log("✅ Conversation saved successfully");
    
            // 🔹 Clear sessionStorage only after save confirmation
            sessionStorage.removeItem("conversationId");
            setConversationId('');
            setMessages([]); // Clear chat window
            setIsChatActive(false);
        } catch (error) {
            console.error("⚠️ Error saving conversation:", error);
        }
    };
    



    //Send message to AI model
    const sendMessage = async () => {
        if (!input.trim()) return;

        const timestamp = new Date().toLocaleTimeString();
        const userMessage: Message = { role: 'user', content: input, timestamp };

        // Append user message to chat
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setIsChatActive(true);

        resetInactivityTimer(); // Restart inactivity timer

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    modelName,
                    user_input: input,
                    system_prompt: systemPrompt,
                    temperature,
                    max_tokens: maxLength,
                    top_p: topP,
                    frequency_penalty: frequencyPenalty,
                    conversation_id: conversationId,
                }),
            });

            if (!response.body) throw new Error("⚠️ No response body received.");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';

            setMessages((prev) => [...prev, { role: 'ai', content: '', timestamp }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                aiResponse += decoder.decode(value, { stream: true });

                setMessages((prev) =>
                    prev.map((msg, index) =>
                        index === prev.length - 1 && msg.role === 'ai' ? { ...msg, content: aiResponse } : msg
                    )
                );
            }

            console.log("📜 FULL CONVERSATION HISTORY:", [...messages, { role: 'user', content: input, timestamp }, { role: 'ai', content: aiResponse, timestamp }]);

        } catch (error) {
            console.error("⚠️ Chat API Streaming Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className='flex flex-col h-full w-full max-h-screen'>
            <CardHeader>
                <CardTitle>🤖 AI Chat</CardTitle>
            </CardHeader>
            <Separator />

            <CardContent className='flex-grow overflow-y-auto p-4 space-y-4'>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col w-fit max-w-[85%] ${msg.role === 'user' ? 'ml-auto text-right' : 'text-left'}`}>
                        <span className='text-xs font-semibold text-zinc-400'>{msg.role === 'user' ? 'You' : 'AI Assistant'}</span>
                        <div className={`p-2 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-secondary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </CardContent>

            <div className='sticky bottom-0 p-3 flex items-center'>
                <Input type='text' value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className='flex-1' />
                <Button onClick={sendMessage} disabled={loading}>{loading ? 'Thinking...' : 'Send'}</Button>
                {isChatActive && <Button onClick={endChat} variant='secondary'>End Chat</Button>}
            </div>
        </Card>
    );
}
