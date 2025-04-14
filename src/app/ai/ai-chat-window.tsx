'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';



import Image from 'next/image';



import useSpeechToText from '@/app/hooks/useSpeechRecognition';
import ButtonWithTooltip from '@/components/button-with-tooltip';
import CodeDisplayBlock from '@/components/code-display-block';
import MultiImagePicker from '@/components/image-embedder';
import { ChatBubble, ChatBubbleAction, ChatBubbleActionWrapper, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { Button } from '@/registry/new-york/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Input } from '@/registry/new-york/ui/input';
import { Separator } from '@/registry/new-york/ui/separator';
import { CheckIcon, CopyIcon, Cross1Icon, Pencil1Icon } from '@radix-ui/react-icons';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';



import useAIChatStore from '../hooks/useAIChatStore';
import AIChatInput from './ai-chat-input';
import { ChatRequestOptions } from 'ai';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { ImageIcon, Mic, SendHorizonal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';


interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    isEditing?: boolean;
    attachments?: { url: string; contentType?: string }[];
    versions?: string[]; // Array of previous message versions
    currentVersion?: number; // Index of currently displayed version
    latestContent?: string; // Stores the latest edited content
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

const MOTION_CONFIG = {
    initial: { opacity: 0, scale: 1, y: 20, x: 0 },
    animate: { opacity: 1, scale: 1, y: 0, x: 0 },
    exit: { opacity: 0, scale: 1, y: 20, x: 0 },
    transition: { opacity: { duration: 0.1 }, layout: { type: 'spring', bounce: 0.3, duration: 0.2 } }
};

/**
 * AIChatWindow is a React component that provides a chat interface for interacting with an AI model.
 * It supports real-time communication via WebSocket, message editing, version history, and image uploads.
 *
 * @component
 * @param {AIChatWindowProps} props - The properties for the AIChatWindow component.
 * @param {string} [props.modelName='gpt-4o'] - The name of the AI model to use.
 * @param {string} [props.systemPrompt='You are an AI assistant'] - The system prompt to guide the AI's behavior.
 * @param {number} [props.temperature=0.7] - The temperature setting for the AI model, controlling randomness.
 * @param {number} [props.maxLength=256] - The maximum token length for AI responses.
 * @param {number} [props.topP=0.9] - The top-p sampling parameter for controlling diversity.
 * @param {number} [props.frequencyPenalty=0] - The penalty for repeated tokens in AI responses.
 * @param {boolean} [props.stream=true] - Whether to enable streaming responses from the AI.
 *
 * @returns {JSX.Element} A chat interface with features like message editing, version history, and image uploads.
 *
 * @remarks
 * - This component uses WebSocket for real-time communication with the AI backend.
 * - It supports user and AI messages, including markdown rendering and code blocks.
 * - Users can edit messages, navigate through version history, and upload images.
 * - AI responses can be regenerated, and messages can be copied to the clipboard.
 *
 * @example
 * ```tsx
 * <AIChatWindow
 *   modelName="gpt-4"
 *   systemPrompt="You are a helpful assistant."
 *   temperature={0.8}
 *   maxLength={512}
 *   topP={0.95}
 *   frequencyPenalty={0.5}
 *   stream={true}
 * />
 * ```
 */
export default function AIChatWindow({
    modelName = 'gpt-4o',
    systemPrompt = 'You are an AI assistant',
    temperature = 0.7,
    maxLength = 256,
    topP = 0.9,
    frequencyPenalty = 0,
    stream = true
}: AIChatWindowProps) {
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socket = useRef<WebSocket | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [input, setInput] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
    let aiResponse = ''; // Temporary variable to accumulate AI response tokens

    // Handle basic chat state and actions without a store
    // const [conversationId, setConversationId] = useState<string>(uuidv4());
    // const [messages, setMessages] = useState<Message[]>([]);

    // const [loading, setLoading] = useState(false);
    // const [base64Images, setBase64Images] = useState<string[]>([]);
    // const [editInput, setEditInput] = useState<string>('');

    /******************************************************************
     * 🔄 useAIChatStore
     * ----------------------------------------------------------------
     * A custom Zustand store that manages all chat-related state and
     * provides persistence between sessions. This store replaces
     * multiple useState hooks with a centralized state management system.
     *
     * 📦 State provided:
     * - conversationId: Unique ID for the current chat conversation
     * - messages: Array of user and AI messages with version history
     * - input: Current text input value
     * - loading: Boolean indicating if AI is generating a response
     * - base64Images: Array of base64-encoded images for the current message
     * - editInput: Current value when editing a message
     *
     * 🔧 Actions provided:
     * - setConversationId: Update the current conversation ID
     * - setMessages: Update the messages array
     * - setInput: Update the current input value
     * - setLoading: Update the loading state
     * - setBase64Images: Update the array of images
     * - setEditInput: Update the current edit input value
     *
     * All state is automatically persisted between browser sessions.
     * @see ../hooks/useAIChatStore.ts for implementation details
     ******************************************************************/
    const {
        conversationId,
        setConversationId,
        messages,
        setMessages,
        loading,
        setLoading,
        base64Images,
        setBase64Images,
        editInput,
        setEditInput
    } = useAIChatStore();


    // State to handle the scroll to bottom 
    useEffect(() => {
        // Auto-scroll to the bottom when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);






    // Handle state and side effects for WebSocket connection foir AI and user message
    useEffect(() => {
        const connectWebSocket = () => {
            socket.current = new WebSocket('ws://localhost:8000/v1/ws/chat');

            // Track streaming state within this effect scope only
            let isStreamingAi = false;
            let currentStreamContent = '';

            socket.current.onopen = () => {
                console.log('✅ WebSocket connection established.');
            };

            socket.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📩 Received WebSocket message:', data);

                    // Handle user message echo (reset streaming state)
                    if (data.role === 'user') {
                        console.log('User message received, resetting streaming state');
                        isStreamingAi = false;
                        currentStreamContent = '';
                        setLoading(false);
                        return; // Exit early, nothing else to process for user messages
                    }

                    // Handle AI messages
                    if (data.role === 'ai') {
                        // IMPORTANT: Check if this is an empty message - don't create bubbles for empty content
                        // Many WebSocket implementations send an empty message to signal the start

                        // For the first token of a new response
                        if (!isStreamingAi) {
                            console.log('Starting new AI response stream');
                            isStreamingAi = true;
                            currentStreamContent = data.content || ''; // Initialize with first chunk

                            // Only create a new message if this is truly a new response
                            // (avoid creating empty bubbles)
                            setMessages((prev) => [
                                ...prev,
                                {
                                    role: 'ai',
                                    content: currentStreamContent,
                                    timestamp: new Date().toLocaleTimeString()
                                }
                            ]);
                        } else {
                            // For subsequent tokens in this response
                            if (data.content) {
                                // Only update if there's actual content
                                currentStreamContent += data.content;

                                // Update the last message
                                setMessages((prev) => {
                                    const lastIndex = prev.length - 1;
                                    if (lastIndex >= 0 && prev[lastIndex].role === 'ai') {
                                        // Create a new array with all the previous messages
                                        const updatedMessages = [...prev];
                                        // Update only the last message's content
                                        updatedMessages[lastIndex] = {
                                            ...updatedMessages[lastIndex],
                                            content: currentStreamContent
                                        };
                                        return updatedMessages;
                                    }
                                    return prev;
                                });
                            }
                        }
                    }

                    // Handle end of response
                    if (data.end_of_response) {
                        console.log('End of response received');
                        isStreamingAi = false;
                        currentStreamContent = '';
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('⚠️ Error parsing WebSocket message:', error);
                    isStreamingAi = false;
                    currentStreamContent = '';
                    setLoading(false);
                }
            };

            // Add to the onopen handler:
            socket.current.onopen = () => {
                console.log('✅ WebSocket connection established.');
                setConnectionStatus('connected');
            };

            // Update your onclose handler:
            socket.current.onclose = (event) => {
                console.log('❌ WebSocket connection closed:', event.reason || 'No reason provided.');
                isStreamingAi = false;
                currentStreamContent = '';
                setLoading(false);
                setConnectionStatus('disconnected');

                setTimeout(() => {
                    console.log('🔄 Attempting to reconnect WebSocket...');
                    setConnectionStatus('connecting');
                    connectWebSocket();
                }, 3000);
            };
            // Add to the onerror handler:
            socket.current.onerror = (error) => {
                console.error('⚠️ WebSocket error:', error);

                // Show the actual error message if available
                if (error && error instanceof Event && error.target) {
                    const target = error.target as WebSocket;
                    console.error('WebSocket error details:', {
                        readyState: target.readyState,
                        url: target.url,
                        protocol: target.protocol,
                        extensions: target.extensions
                    });
                }

                // Reset states
                isStreamingAi = false;
                currentStreamContent = '';
                setLoading(false);
                setConnectionStatus('disconnected');

                // Add a UI notification for users
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'ai',
                        content: '⚠️ Connection to AI service lost. Please try again in a moment.',
                        timestamp: new Date().toLocaleTimeString()
                    }
                ]);

                // Try to reconnect after a short delay
                setTimeout(() => {
                    console.log('🔄 Attempting to reconnect after error...');
                    if (socket.current) {
                        try {
                            socket.current.close();
                        } catch (e) {
                            // Ignore errors when closing an already closed socket
                        }
                    }
                    connectWebSocket();
                }, 5000);
            };
        };

        connectWebSocket();

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, []);















    
    const sendMessage = () => {
        if (!input.trim()) return;

        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
            console.error('⚠️ WebSocket is not open. Cannot send message.');
            return;
        }

        const timestamp = new Date().toLocaleTimeString();
        const userMessage: Message = { role: 'user', content: input, timestamp };

        // Append user message to chat
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setBase64Images([]);
        setLoading(true);

        const payload = {
            modelName,
            user_input: input,
            system_prompt: systemPrompt,
            temperature,
            max_tokens: maxLength,
            top_p: topP,
            frequency_penalty: frequencyPenalty,
            conversation_id: conversationId,
            attachments: base64Images.map((image) => ({ url: image, contentType: 'image/png' }))
        };

        console.log('📤 Sending WebSocket message:', payload);

        try {
            socket.current.send(JSON.stringify(payload));
        } catch (error) {
            console.error('⚠️ Error sending WebSocket message:', error);
        }
    };

    // Add this function to handle canceling edits
    const cancelEdit = (index: number) => {
        console.log('🚫 Canceling edit for message index:', index);
        setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, isEditing: false } : msg)));
    };

    // Handle message edit
    const handleEdit = (index: number, newContent: string) => {
        setMessages((prev) =>
            prev.map((msg, i) => (i === index ? { ...msg, content: newContent, isEditing: false } : msg))
        );
    };

    // Handle message copy to clipboard
    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        console.log('📋 Copied to clipboard:', content);
    };

    // Handle message regeneration from AI
    const handleRegenerate = (index: number) => {
        const aiMessage = messages[index];
        const payload = {
            modelName,
            user_input: `Recall previous conversations and regenerate a better response that meets the user's expectations.`,
            system_prompt: systemPrompt,
            temperature,
            max_tokens: maxLength,
            top_p: topP,
            frequency_penalty: frequencyPenalty,
            conversation_id: conversationId
        };

        console.log('📤 Sending regenerate request:', payload);

        try {
            socket.current?.send(JSON.stringify(payload));
            setLoading(true);
        } catch (error) {
            console.error('⚠️ Error sending regenerate request:', error);
        }
    };

    // Handle image upload
    const handleImageUpload = async (images: string[]) => {
        if (images.length === 0) return;

        setLoading(true); // Set loading to true while uploading

        const timestamp = new Date().toLocaleTimeString();
        const imageMessage: Message = {
            role: 'user',
            content: '', // No text content for image-only messages
            timestamp,
            attachments: images.map((image) => ({ url: image, contentType: 'image/png' }))
        };

        // Append the image message to the chat
        setMessages((prev) => [...prev, imageMessage]);

        // Send the image message via WebSocket
        const payload = {
            modelName,
            user_input: '', // No text input for image-only messages
            system_prompt: systemPrompt,
            temperature,
            max_tokens: maxLength,
            top_p: topP,
            frequency_penalty: frequencyPenalty,
            conversation_id: conversationId,
            attachments: images.map((image) => ({ url: image, contentType: 'image/png' }))
        };

        console.log('📤 Sending image message:', payload);

        try {
            socket.current?.send(JSON.stringify(payload));
        } catch (error) {
            console.error('⚠️ Error sending image message:', error);
        } finally {
            setLoading(false); // Reset loading state after upload
        }
    };

    /**
     * Handles submitting an edited message, updating version history, and optionally sending to backend
     *
     * This function:
     * 1. Stores version history for edited messages
     * 2. Updates the UI with the new content
     * 3. Optionally sends the edited message to the backend
     * 4. Maintains a browsable history of all edits
     *
     * @param index - The index of the message being edited
     * @param newContent - The new content for the message
     */
    const handleSendEdit = (index: number, newContent: string) => {
        console.log('📝 handleSendEdit called with:', { index, newContent });

        // Skip if content is unchanged
        if (messages[index].content === newContent) {
            console.log('⏭️ Content unchanged, just disabling edit mode');
            setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, isEditing: false } : msg)));
            return;
        }

        setMessages((prev) => {
            const message = prev[index];
            console.log('📄 Original message:', message);

            // Create a DEEP COPY of versions array to avoid reference issues
            let versions = [...(message.versions || [])];

            // Get the current content before replacement
            const currentContent = message.content;

            console.log('📋 Current versions array:', versions);

            // First edit: store the original message content
            if (versions.length === 0) {
                versions = [currentContent];
                console.log('🆕 First edit: storing original content:', currentContent);
            }
            // Subsequent edits: store the current content before replacing it
            else {
                // Add the current content to the versions array
                versions.push(currentContent);
                console.log('➕ Subsequent edit: adding current content to versions:', currentContent);
            }

            // Calculate total versions (including the new one we're adding)
            const totalVersions = versions.length + 1; // +1 for the new edit
            console.log(`📊 Total versions after this edit: ${totalVersions}`);

            // Create updated message object with new content and version history
            const updatedMessage = {
                ...message,
                content: newContent, // Set new content
                isEditing: false, // Exit edit mode
                versions: versions, // Store version history
                currentVersion: versions.length, // Point to the latest version (which will be the new content)
                latestContent: newContent // IMPORTANT: Store the latest content separately
            };

            console.log('✅ Updated message with versions:', updatedMessage);

            // Return new messages array with the updated message
            return prev.map((msg, i) => (i === index ? updatedMessage : msg));
        });

        // TODO: In the future, implement persistence to database for edit history

        // Send to backend (if WebSocket is open)
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const payload = {
                modelName,
                user_input: newContent,
                system_prompt: systemPrompt,
                is_edited: true,
                temperature,
                max_tokens: maxLength,
                top_p: topP,
                frequency_penalty: frequencyPenalty,
                conversation_id: conversationId
            };

            console.log('📤 Sending edited message to backend:', payload);

            try {
                socket.current.send(JSON.stringify(payload));
                setLoading(true);
            } catch (error) {
                console.error('⚠️ Error sending edited message:', error);
                // Handle error gracefully - show error message or retry
            }
        } else {
            console.warn('⚠️ WebSocket not connected - edit will not be processed by AI');
            // Could show a warning toast to the user here
        }
    };

    // Navigate to previous version of a message
    const handlePrevVersion = (index: number) => {
        console.log('⬅️ handlePrevVersion called for message index:', index);

        setMessages((prev) => {
            const message = prev[index];

            // Ensure we have versions to navigate
            if (!message.versions?.length || message.currentVersion === undefined) {
                console.log('⚠️ No versions to navigate or currentVersion undefined');
                return prev;
            }

            // Get current version index and total versions
            const currentVersion = message.currentVersion;
            const totalVersions = message.versions.length + 1; // +1 for current edit

            console.log(`📊 Current position: ${currentVersion + 1}/${totalVersions}`);

            // Can we go back?
            if (currentVersion <= 0) {
                console.log('⛔ Already at earliest version');
                return prev;
            }

            // Calculate new version to display (always going backward)
            const newVersion = currentVersion - 1;

            // Get content for the previous version
            // This will ALWAYS be from the versions array
            const previousContent = message.versions[newVersion];

            console.log(`⏪ Moving to version ${newVersion + 1}/${totalVersions}`);
            console.log(`📋 Previous content: "${previousContent.substring(0, 30)}..."`);

            // Update just this message
            return prev.map((msg, i) =>
                i === index
                    ? {
                          ...msg,
                          currentVersion: newVersion,
                          content: previousContent // Show previous content
                      }
                    : msg
            );
        });
    };

    // Navigate to next version of a message
    const handleNextVersion = (index: number) => {
        console.log('➡️ handleNextVersion called for message index:', index);

        setMessages((prev) => {
            const message = prev[index];

            // Ensure we have versions to navigate
            if (!message.versions?.length || message.currentVersion === undefined) {
                console.log('⚠️ No versions to navigate or currentVersion undefined');
                return prev;
            }

            // Get current version index and total versions
            const currentVersion = message.currentVersion;
            const totalVersions = message.versions.length + 1; // +1 for current edit

            console.log(`📊 Current position: ${currentVersion + 1}/${totalVersions}`);

            // Can we go forward?
            if (currentVersion >= message.versions.length) {
                console.log('⛔ Already at latest version');
                return prev;
            }

            // Calculate new version to display (always going forward)
            const newVersion = currentVersion + 1;

            // Get content to display for next version
            let nextContent;

            if (newVersion < message.versions.length) {
                // If not at the last version, get from versions array
                nextContent = message.versions[newVersion];
                console.log(`⏩ Moving to stored version ${newVersion + 1}/${totalVersions}`);
            } else {
                // If moving to latest version (current edit)
                // We need the ACTUAL current content (not in versions array)
                // If moving to latest version (current edit)
                // Use the latestContent property which stores the most recent edit
                const latestMessage = prev.find((m, i) => i === index);
                nextContent = latestMessage?.latestContent || latestMessage?.content || '';
                console.log(`⏩ Moving to latest edit (version ${newVersion + 1}/${totalVersions})`);
            }

            console.log(`📋 Next content: "${nextContent.substring(0, 30)}..."`);

            // Update just this message
            return prev.map((msg, i) =>
                i === index
                    ? {
                          ...msg,
                          currentVersion: newVersion,
                          content: nextContent // Show next content
                      }
                    : msg
            );
        });
    };

    return (
        <Card className='flex h-full max-h-screen w-full flex-col'>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle>🤖 AI Chat</CardTitle>
                    <div className='flex items-center gap-2'>
                        <span
                            className={`inline-block h-2 w-2 rounded-full ${
                                connectionStatus === 'connected'
                                    ? 'bg-green-500'
                                    : connectionStatus === 'connecting'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                            }`}></span>
                        <span className='text-xs text-gray-500'>
                            {connectionStatus === 'connected'
                                ? 'Connected'
                                : connectionStatus === 'connecting'
                                  ? 'Connecting...'
                                  : 'Disconnected'}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <Separator />

            <CardContent className='flex-grow space-y-4 overflow-y-auto p-4'>
                {messages.map((message, index) => {
                    // ✅ Extract DeepSeek <think> content
                    const getThinkContent = (content: string) => {
                        const match = content.match(/<think>([\s\S]*?)(?:<\/think>|$)/);
                        return match ? match[1].trim() : null;
                    };

                    const thinkContent = message.role === 'ai' ? getThinkContent(message.content) : null;

                    const cleanContent = message.content.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '').trim();

                    const contentParts = cleanContent.split('```');

                    // ✅ Renders the <think> section
                    const renderThinkingProcess = () =>
                        thinkContent && (
                            <details className='mb-2 text-sm' open>
                                <summary className='cursor-pointer text-muted-foreground hover:text-foreground'>
                                    Thinking process
                                </summary>
                                <div className='mt-2 text-muted-foreground'>
                                    <Markdown remarkPlugins={[remarkGfm]}>{thinkContent}</Markdown>
                                </div>
                            </details>
                        );

                    const renderAttachments = (attachments: { url: string; contentType?: string }[]) => {
                        console.log('🖼️ Rendering attachments:', attachments); // ✅ ADD HERE
                        return attachments.length > 0 ? (
                            <div className='flex gap-2 py-2'>
                                {attachments
                                    .filter((att) => att.contentType?.startsWith('image/'))
                                    .map((att, idx) => (
                                        <Image
                                            key={idx}
                                            src={att.url}
                                            width={200}
                                            height={200}
                                            alt={`attachment-${idx}`}
                                            className='rounded-md object-contain'
                                        />
                                    ))}
                            </div>
                        ) : null;
                    };

                    // Renders markdown and code split by ```
                    const renderContent = () =>
                        contentParts.map((part, idx) =>
                            idx % 2 === 0 ? (
                                <Markdown key={idx} remarkPlugins={[remarkGfm]}>
                                    {part}
                                </Markdown>
                            ) : (
                                <pre className='whitespace-pre-wrap' key={idx}>
                                    <CodeDisplayBlock code={part} />
                                </pre>
                            )
                        );

                    return (
                        <ChatBubble
                            key={index}
                            variant={message.role === 'user' ? 'sent' : 'received'}
                            className={`max-w-[100%] ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
                            <ChatBubbleMessage className='px-4 pb-1 pt-2 text-white dark:text-white'>
                                {message.role === 'ai' ? (
                                    <>
                                        {renderThinkingProcess()}
                                        {message.attachments && renderAttachments(message.attachments)}
                                        {renderContent()}
                                    </>
                                ) : message.isEditing ? (
                                    <div className='flex w-full gap-2'>
                                        <textarea
                                            value={editInput}
                                            onChange={(e) => setEditInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendEdit(index, editInput);
                                                }
                                            }}
                                            className='w-full min-w-[100px] flex-1 resize-y rounded-md border border-zinc-300 bg-white p-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-muted dark:text-white dark:placeholder:text-zinc-500 dark:focus:ring-zinc-600'
                                            autoFocus
                                            onBlur={() => {
                                                setTimeout(() => {
                                                    if (document.activeElement?.tagName !== 'BUTTON') {
                                                        cancelEdit(index);
                                                    }
                                                }, 100);
                                            }}
                                            rows={1}
                                        />

                                        {/* Cancel Button */}
                                        <Button
                                            onClick={() => cancelEdit(index)}
                                            size='sm'
                                            variant='outline'
                                            className='bg- m-0 shrink-0 border-none bg-transparent p-0 hover:bg-transparent focus:outline-none focus:ring-0'>
                                            <Cross1Icon className='h-4 w-4 text-gray-300 hover:text-gray-700 active:text-gray-900' />
                                        </Button>
                                        {/* Send Button */}
                                        <Button
                                            onClick={() => handleSendEdit(index, editInput)}
                                            size='sm'
                                            variant='ghost'
                                            className='m-0 shrink-0 bg-transparent p-0 hover:bg-transparent focus:outline-none focus:ring-0'>
                                            <SendHorizonal className='h-4 w-4 text-gray-300 hover:text-gray-700 active:text-gray-900' />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {message.attachments && renderAttachments(message.attachments)}
                                        <div className='relative'>
                                            {message.content}
                                            {message.versions && message.versions.length > 0 && (
                                                <div className='absolute -top-4 right-0 text-xs text-muted-foreground'>
                                                    {message.currentVersion !== undefined
                                                        ? message.currentVersion + 1
                                                        : 1}
                                                    /{(message.versions?.length || 0) + 1}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                {/* Render the AI response if it exists */}
                                {/* Action Buttons */}
                                <div className='items-left flex justify-between text-xs font-semibold text-muted-foreground text-zinc-400'>
                                    <ChatBubbleActionWrapper
                                        variant={message.role === 'user' ? 'sent' : 'received'}
                                        className='!static !bottom-0 !left-0 !right-auto !top-auto mt-2 flex !translate-x-0 !translate-y-0 gap-2 opacity-100 transition-none'>
                                        {message.role === 'user' && (
                                            <>
                                                <ButtonWithTooltip toolTipText='Edit Message' side='top'>
                                                    <ChatBubbleAction
                                                        icon={<Pencil1Icon className='h-4 w-4' />}
                                                        onClick={() => {
                                                            // Set the edit input to the current message content FIRST
                                                            setEditInput(message.content);
                                                            // Then set the message to editing mode
                                                            setMessages((prev) =>
                                                                prev.map((m, i) =>
                                                                    i === index ? { ...m, isEditing: true } : m
                                                                )
                                                            );
                                                        }}
                                                        className='text-gray-400 hover:bg-transparent hover:text-gray-400'
                                                        variant='ghost'
                                                        size='icon'
                                                    />
                                                </ButtonWithTooltip>
                                                {message.versions && message.versions.length > 0 && (
                                                    <div className='ml-2 flex items-center gap-1'>
                                                        <ButtonWithTooltip toolTipText='Previous Version' side='top'>
                                                            <ChatBubbleAction
                                                                icon={<ChevronLeftIcon className='h-3 w-3' />}
                                                                onClick={() => handlePrevVersion(index)}
                                                                disabled={(message.currentVersion || 0) <= 0}
                                                                className='text-gray-400 hover:bg-transparent hover:text-gray-400'
                                                                variant='ghost'
                                                                size='icon'
                                                            />
                                                        </ButtonWithTooltip>

                                                        <span className='text-xs'>
                                                            {(message.currentVersion || 0) + 1}/
                                                            {(message.versions?.length || 0) + 1}
                                                        </span>

                                                        <ButtonWithTooltip toolTipText='Next Version' side='top'>
                                                            <ChatBubbleAction
                                                                icon={<ChevronRightIcon className='h-3 w-3' />}
                                                                onClick={() => handleNextVersion(index)}
                                                                disabled={
                                                                    (message.currentVersion || 0) >=
                                                                    (message.versions?.length || 0)
                                                                }
                                                                className='text-gray-400 hover:bg-transparent hover:text-gray-400'
                                                                variant='ghost'
                                                                size='icon'
                                                            />
                                                        </ButtonWithTooltip>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {message.role === 'ai' && (
                                            <>
                                                <ButtonWithTooltip toolTipText='Copy Response' side='top'>
                                                    <ChatBubbleAction
                                                        icon={<CopyIcon className='h-4 w-4' />}
                                                        onClick={() => handleCopy(message.content)}
                                                        className='text-gray-400 hover:bg-transparent hover:text-gray-400'
                                                    />
                                                </ButtonWithTooltip>
                                                <ButtonWithTooltip toolTipText='Regenerate Response' side='top'>
                                                    <ChatBubbleAction
                                                        icon={<RefreshCcw className='h-4 w-4' />}
                                                        onClick={() => handleRegenerate(index)}
                                                        className='text-gray-400 hover:bg-transparent hover:text-gray-400'
                                                    />
                                                </ButtonWithTooltip>
                                            </>
                                        )}
                                    </ChatBubbleActionWrapper>
                                </div>
                            </ChatBubbleMessage>
                        </ChatBubble>
                    );
                })}
                <div ref={messagesEndRef} />
            </CardContent>

            <AIChatInput
                input={input}
                setInput={setInput}
                onSend={sendMessage}
                isLoading={loading}
                setBase64Images={setBase64Images}
                handleImageUpload={handleImageUpload}
            />
        </Card>
    );
}