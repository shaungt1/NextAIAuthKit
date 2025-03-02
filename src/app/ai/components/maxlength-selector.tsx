'use client';

import * as React from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/registry/new-york/ui/hover-card';
import { Label } from '@/registry/new-york/ui/label';
import { Slider } from '@/registry/new-york/ui/slider';
import { SliderProps } from '@radix-ui/react-slider';

interface MaxLengthSelectorProps {
    defaultValue: SliderProps['defaultValue'];
    onValueChange: (newValue: number) => void; 
}

export function MaxLengthSelector({ defaultValue, onValueChange }: MaxLengthSelectorProps) {
    const [value, setValue] = React.useState(defaultValue);
    const handleValueChange = (val: number[]) => {
        setValue(val);
        onValueChange(val[0]);
    }
    return (
        <div className='grid gap-2 pt-2'>
            <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                    <div className='grid gap-4'>
                        <div className='flex items-center justify-between'>
                            <Label htmlFor='maxlength'>Max Tokens</Label>
                            <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
                                {value}
                            </span>
                        </div>
                        <Slider
                            id='maxlength'
                            max={4564}
                            defaultValue={value}
                            step={10}
                            onValueChange={handleValueChange}
                            className='[&_[role=slider]]:size-4'
                            aria-label='Maximum Length'
                        />
                    </div>
                </HoverCardTrigger>
                <HoverCardContent align='start' className='w-[260px] text-sm' side='left'>
                    The maximum number of tokens to generate. Requests can use up to 2,048 or 4,000 tokens, shared
                    between prompt and completion. The exact limit varies by model.
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
