import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Match the exact Message interface from ai-chat-window.tsx
interface Message {
    id?: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    isEditing?: boolean;
    attachments?: { url: string; contentType?: string }[];
    versions?: string[]; // Array of previous message versions
    currentVersion?: number; // Index of currently displayed version
    latestContent?: string; // Stores the latest edited content
}

// Create a store with the same variable names as your useState hooks
interface AIChatState {
    // Core chat state
    conversationId: string;
    messages: Message[];
    input: string;
    loading: boolean;
    base64Images: string[];
    editInput: string;

    // Additional persistent state
    chatHistory: Record<string, Message[]>; // Store multiple conversations
    selectedModel: string;
}

interface AIChatActions {
    // Direct replacements for your useState setters
    setConversationId: (id: string) => void;
    setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
    setInput: (input: string) => void;
    setLoading: (loading: boolean) => void;
    setBase64Images: (images: string[]) => void;
    setEditInput: (input: string) => void;
    setSelectedModel: (model: string) => void;

    // Additional utility functions
    createNewChat: () => string;
    loadChat: (id: string) => void;
    saveCurrentChat: () => void;
    deleteChat: (id: string) => void;
    clearMessages: () => void;
}

const useAIChatStore = create<AIChatState & AIChatActions>()(
    persist(
        (set, get) => ({
            // Initial state (matches your useState defaults)
            conversationId: uuidv4(),
            messages: [],
            input: '',
            loading: false,
            base64Images: [],
            editInput: '',
            chatHistory: {},
            selectedModel: 'gpt-4o',

            // Direct replacements for your useState setters
            setConversationId: (id) => set({ conversationId: id }),

            setMessages: (messagesOrFn) =>
                set((state) => {
                    const newMessages =
                        typeof messagesOrFn === 'function' ? messagesOrFn(state.messages) : messagesOrFn;

                    // Automatically save to history when messages change
                    const chatHistory = {
                        ...state.chatHistory,
                        [state.conversationId]: newMessages
                    };

                    return { messages: newMessages, chatHistory };
                }),

            setInput: (input) => set({ input }),
            setLoading: (loading) => set({ loading }),
            setBase64Images: (images) => set({ base64Images: images }),
            setEditInput: (input) => set({ editInput: input }),
            setSelectedModel: (model) => set({ selectedModel: model }),

            // Additional utility functions
            createNewChat: () => {
                const newId = uuidv4();
                set({
                    conversationId: newId,
                    messages: [],
                    input: '',
                    base64Images: []
                });
                return newId;
            },

            loadChat: (id) => {
                const state = get();
                const chatMessages = state.chatHistory[id] || [];
                set({
                    conversationId: id,
                    messages: chatMessages,
                    input: '',
                    base64Images: []
                });
            },

            saveCurrentChat: () => {
                const state = get();
                const chatHistory = {
                    ...state.chatHistory,
                    [state.conversationId]: state.messages
                };
                set({ chatHistory });
            },

            deleteChat: (id) =>
                set((state) => {
                    const { [id]: _, ...remainingChats } = state.chatHistory;
                    // If deleting current chat, create a new one
                    if (id === state.conversationId) {
                        const newId = uuidv4();
                        return {
                            chatHistory: remainingChats,
                            conversationId: newId,
                            messages: []
                        };
                    }
                    return { chatHistory: remainingChats };
                }),

            clearMessages: () => set({ messages: [] })
        }),
        {
            name: 'ai-chat-storage', // Storage key
            partialize: (state) => ({
                // Only persist these fields
                chatHistory: state.chatHistory,
                selectedModel: state.selectedModel
            })
        }
    )
);

export default useAIChatStore;
