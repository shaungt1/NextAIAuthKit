'use client';

import { useState } from 'react';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Textarea } from '@/registry/new-york/ui/textarea';
import { Separator } from '@/registry/new-york/ui/separator';

interface Message {
    role: 'user' | 'ai';
    content: string;
}
// Genaric chat page for AI 
export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        const newMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_input: input, system_prompt: systemPrompt }),
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: 'ai', content: '⚠️ Error: Failed to fetch response.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex h-screen'>
            {/* Sidebar for System Prompt */}
            <aside className='w-1/4 bg-muted p-4 flex flex-col space-y-4 border-r'>
                <h2 className='text-lg font-semibold'>System Prompt</h2>
                <Textarea
                    placeholder='Define AI behavior...'
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className='h-40'
                />
            </aside>

            {/* Chat Window */}
            <main className='flex flex-col flex-1 p-4'>
                <Card className='flex flex-1 flex-col'>
                    <CardHeader>
                        <CardTitle>🤖 AI Chat</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className='flex-grow overflow-y-auto space-y-4 p-4'>
                        {messages.length === 0 && (
                            <p className='text-center text-muted-foreground'>Start a conversation with the AI.</p>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-md w-fit ${
                                    msg.role === 'user' ? 'bg-primary text-white self-end' : 'bg-secondary text-black self-start'
                                }`}>
                                {msg.content}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Chat Input */}
                <div className='fixed bottom-4 left-1/4 w-3/4 flex items-center bg-background p-2 border rounded-lg'>
                    <Input
                        type='text'
                        placeholder='Type a message...'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className='flex-1 mr-2'
                    />
                    <Button onClick={sendMessage} disabled={loading}>
                        {loading ? 'Thinking...' : 'Send'}
                    </Button>
                </div>
            </main>
        </div>
    );
}
