'use client';

import * as React from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/registry/new-york/ui/hover-card';
import { Label } from '@/registry/new-york/ui/label';
import { Slider } from '@/registry/new-york/ui/slider';
import { SliderProps } from '@radix-ui/react-slider';

interface TopPSelectorProps {
    defaultValue: SliderProps['defaultValue'];
    onValueChange: (newValue: number) => void; 
}

export function TopPSelector({ defaultValue, onValueChange}: TopPSelectorProps) {
    const [value, setValue] = React.useState<number[]>(defaultValue || []);
    
    const handleValueChange = (val: number[]) => {
        setValue(val);
        onValueChange(val[0]);
    };
    
    return (
        <div className='grid gap-2 pt-2'>
            <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                    <div className='grid gap-4'>
                        <div className='flex items-center justify-between'>
                            <Label htmlFor='top-p'>Top P</Label>
                            <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
                                {value}
                            </span>
                        </div>
                        <Slider
                            id='top-p'
                            max={1}
                            defaultValue={value}
                            step={0.1}
                            onValueChange={handleValueChange} 
                            className='[&_[role=slider]]:size-4'
                            aria-label='Top P'
                          
                        />
                    </div>
                </HoverCardTrigger>
                <HoverCardContent align='start' className='w-[260px] text-sm' side='left'>
                    Control diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are
                    considered. Best used in combination with temperature at 1.0.
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
