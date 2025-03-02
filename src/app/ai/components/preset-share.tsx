'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';
import { Label } from '@/registry/new-york/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york/ui/popover';
import { CopyIcon } from '@radix-ui/react-icons';
import { v4 as uuidv4 } from 'uuid';

export function PresetShare() {
    // State to store the shareable link
    const [shareableLink, setShareableLink] = useState('');

    // Generate shareable URL when the component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.href.split('?')[0]; // Ensure clean base URL
            const uniqueId = uuidv4(); // Generate a unique ID
            setShareableLink(`${currentUrl}?shareId=${uniqueId}`);
        }
    }, []);

    // Function to copy the link to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareableLink);
            console.log('✅ Link copied to clipboard:', shareableLink);
        } catch (err) {
            console.error('⚠️ Failed to copy link:', err);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='secondary'>Share</Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-[520px]'>
                <div className='flex flex-col space-y-2 text-center sm:text-left'>
                    <h3 className='text-lg font-semibold'>Share preset</h3>
                    <p className='text-sm text-muted-foreground'>
                        Anyone with this link can view this.
                    </p>
                </div>
                <div className='flex items-center space-x-2 pt-4'>
                    <div className='grid flex-1 gap-2'>
                        <Label htmlFor='link' className='sr-only'>
                            Link
                        </Label>
                        <Input id='link' value={shareableLink} readOnly className='h-9' />
                    </div>
                    <Button onClick={copyToClipboard} size='sm' className='px-3'>
                        <span className='sr-only'>Copy</span>
                        <CopyIcon className='size-4' />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
