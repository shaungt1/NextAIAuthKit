'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/registry/new-york/ui/button';
import { CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import { Input } from '@/registry/new-york/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Separator } from '@/registry/new-york/ui/separator';

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

interface AIChatWindowProps {
    systemPrompt?: string;
    temperature?: number;
    maxLength?: number;
    topP?: number;
    frequencyPenalty?: number;
    stream?: boolean;
}

export default function AIChatWindow({
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to the bottom when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        async function initializeConversation() {
            if (!session?.user) {
                console.warn("🔹 User is not logged in. Using test conversation ID.");
                const testConversationId = process.env.NEXT_PUBLIC_TEST_CONVERSATION_ID || uuidv4();
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

            try {
                console.log("🔍 Checking database for existing conversation...");
                const response = await fetch(`/api/conversations?userId=${session.user.id}`);
                const data = await response.json();

                if (data.conversationId) {
                    console.log("✅ Found existing conversation ID:", data.conversationId);
                    setConversationId(data.conversationId);
                    sessionStorage.setItem("conversationId", data.conversationId);
                } else {
                    console.log("🚀 No existing conversation. Generating new conversation ID.");
                    const newConversationId = uuidv4();

                    await fetch(`/api/conversations`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: session.user.id,
                            conversationId: newConversationId,
                        }),
                    });

                    setConversationId(newConversationId);
                    sessionStorage.setItem("conversationId", newConversationId);
                }
            } catch (error) {
                console.error("⚠️ Error fetching conversation ID:", error);
            }
        }

        initializeConversation();
    }, [session]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const timestamp = new Date().toLocaleTimeString();
        const newMessage: Message = { role: 'user', content: input, timestamp };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_input: input,
                    system_prompt: systemPrompt,
                    temperature,
                    max_tokens: maxLength,
                    top_p: topP,
                    frequency_penalty: frequencyPenalty,
                    conversation_id: conversationId,
                })
            });

            if (!response.body) throw new Error("⚠️ No response body received.");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                aiResponse += chunk;

                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { role: 'ai', content: aiResponse, timestamp: new Date().toLocaleTimeString() }
                ]);
            }
        } catch (error) {
            console.error("⚠️ Chat API Streaming Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: 'ai', content: '⚠️ Error: Failed to fetch response.', timestamp },
            ]);
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

            {/* Scrollable Chat Messages */}
            <CardContent className='flex-grow overflow-y-auto p-4 space-y-4'>
                {messages.length === 0 && (
                    <p className='text-center text-muted-foreground'>Start a conversation with the AI.</p>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex flex-col w-fit max-w-[85%] ${
                            msg.role === 'user' ? 'ml-auto text-right' : 'text-left'
                        }`}
                    >
                        <span className={`text-xs font-semibold ${msg.role === 'user' ? 'text-zinc-400' : 'text-zinc-400'}`}>
                            {msg.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <div
                            className={`p-2 rounded-lg shadow-md ${
                                msg.role === 'user'
                                    ? 'bg-secondary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                            }`}
                        >
                            {msg.content}
                        </div>
                        <span className='text-xs text-gray-400'>{msg.timestamp}</span>
                    </div>
                ))}

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
            </CardContent>

            {/* Chat Input Stays at the Bottom */}
            <div className='sticky bottom-0 bg-background p-3 border-t flex items-center'>
                <Input
                    type='text'
                    placeholder='Type a message...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className='flex-1 mr-2'
                />
                <Button onClick={sendMessage} disabled={loading}>
                    {loading ? 'Thinking...' : 'Send'}
                </Button>

                <Button className='' variant='secondary'>
                    <span className='sr-only'>Show history</span>
                    <CounterClockwiseClockIcon className='size-4' />
                </Button>
            </div>
        </Card>
    );
}
