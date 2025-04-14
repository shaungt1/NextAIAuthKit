import { memo, useEffect, useRef } from 'react';

import useSpeechToText from '@/app/hooks/useSpeechRecognition';
import MultiImagePicker from '@/components/image-embedder';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';

import { Mic, SendHorizonal } from 'lucide-react';

/**
 * Props for the AIChatInput component
 */
interface AIChatInputProps {
    /** Current input text value */
    input: string;
    /** Function to update input text value */
    setInput: React.Dispatch<React.SetStateAction<string>>;
    /** Function to call when sending a message */
    onSend: () => void;
    /** Whether AI is currently generating a response */
    isLoading: boolean;
    /** Function to update base64-encoded images */
    setBase64Images: (images: string[]) => void;
    /** Function to handle image upload and send to AI */
    handleImageUpload: (images: string[]) => void;
}

/**
 * AIChatInput - A reusable input component for AI chat interfaces
 *
 * Features:
 * - Text input with Enter key handling
 * - Image upload via MultiImagePicker
 * - Voice input via speech recognition
 * - Loading state visualization
 *
 * @component
 */
function AIChatInput({ input, setInput, onSend, isLoading, setBase64Images, handleImageUpload }: AIChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true });

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const handleListenClick = () => {
        isListening ? stopListening() : startListening();
    };

    useEffect(() => {
        if (isListening && transcript) {
            setInput(transcript);
        }
    }, [isListening, transcript, setInput]);

    return (
        <div className='flex items-center gap-2 p-3'>
            <MultiImagePicker
                onImagesPick={(images) => {
                    setBase64Images(images); // Update state
                    if (images.length > 0) {
                        handleImageUpload(images); // Call upload logic
                    }
                }}
                disabled={isLoading} // Disable only when loading
            />

            <Button
                onClick={handleListenClick}
                variant='ghost'
                size='icon'
                className={`shrink-0 rounded-full ${isListening ? 'bg-blue-500/30' : ''}`}>
                <Mic className='h-5 w-5' />
            </Button>
            <Input
                ref={inputRef}
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder='Type your message...'
                className='flex-1'
            />
            <Button
                onClick={onSend}
                disabled={isLoading || !input.trim()}
                className={`shrink-0 rounded-full ${isLoading ? 'animate-pulse' : ''}`}>
                {isLoading ? (
                    <div className='flex items-center gap-2'>
                        <span className='animate-pulse'>Thinking...</span>
                        <SendHorizonal className='h-5 w-5' />
                    </div>
                ) : (
                    <SendHorizonal className='h-5 w-5' />
                )}
            </Button>
        </div>
    );
}

// Use memo to prevent unnecessary re-renders
export default memo(AIChatInput);
