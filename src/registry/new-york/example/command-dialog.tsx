'use client';

import * as React from 'react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from '@/registry/new-york/ui/command';
import { CalendarIcon, EnvelopeClosedIcon, FaceIcon, GearIcon, PersonIcon, RocketIcon } from '@radix-ui/react-icons';

export default function CommandDialogDemo() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);

        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            <p className='text-sm text-muted-foreground'>
                Press{' '}
                <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
                    <span className='text-xs'>⌘</span>J
                </kbd>
            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder='Type a command or search...' />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading='Suggestions'>
                        <CommandItem>
                            <CalendarIcon />
                            <span>Calendar</span>
                        </CommandItem>
                        <CommandItem>
                            <FaceIcon />
                            <span>Search Emoji</span>
                        </CommandItem>
                        <CommandItem>
                            <RocketIcon />
                            <span>Launch</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading='Settings'>
                        <CommandItem>
                            <PersonIcon />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <EnvelopeClosedIcon />
                            <span>Mail</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <GearIcon />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
