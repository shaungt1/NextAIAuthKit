'use client';

import * as React from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/registry/new-york/ui/hover-card';
import { Label } from '@/registry/new-york/ui/label';
import { Slider } from '@/registry/new-york/ui/slider';
import { SliderProps } from '@radix-ui/react-slider';

interface TemperatureSelectorProps {
    defaultValue: SliderProps['defaultValue'];
    onValueChange : (newValue: number) => void;
}

export function TemperatureSelector({ defaultValue,onValueChange  }: TemperatureSelectorProps) {
    const [value, setValue] = React.useState(defaultValue);
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
                            <Label htmlFor='temperature'>Temperature</Label>
                            <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
                                {value}
                            </span>
                        </div>
                        <Slider
                            id='temperature'
                            max={1}
                            defaultValue={value}
                            step={0.1}
                            onValueChange = {handleValueChange}
                            className='[&_[role=slider]]:size-4'
                            aria-label='Temperature'
                        />
                    </div>
                </HoverCardTrigger>
                <HoverCardContent align='start' className='w-[260px] text-sm' side='left'>
                    Controls randomness: lowering results in less random completions. As the temperature approaches
                    zero, the model will become deterministic and repetitive. We find that 0.7 works well for most use cases.
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
