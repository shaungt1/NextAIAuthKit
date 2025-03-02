'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { useMutationObserver } from '@/app/hooks/use-mutation-observer';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/registry/new-york/ui/command';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/registry/new-york/ui/hover-card';
import { Label } from '@/registry/new-york/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york/ui/popover';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { PopoverProps } from '@radix-ui/react-popover';

interface Model {
    id: number;
    name: string;
    description: string;
    type: string;
    inputCost?: number;
    cachedInputCost?: number;
    outputCost?: number;
    totalCost?: number;
    provider: {
        category: string;
        provider: string;
        modelType: string;
    };
}

interface ModelSelectorProps extends PopoverProps {
    onModelSelect: (model: Model) => void;
}

export function ModelSelector({ onModelSelect, ...props }: ModelSelectorProps) {
    const [open, setOpen] = useState(false);
    const [models, setModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [peekedModel, setPeekedModel] = useState<Model | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchModels() {
            try {
                const response = await fetch('/api/ai-models', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data: Model[] = await response.json();
                setModels(data);
                if (data.length > 0) {
                    setSelectedModel(data[0]);
                    setPeekedModel(data[0]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching models:', error);
                setLoading(false);
            }
        }
    
        fetchModels();
    }, []);
    

    if (loading) {
        return <p>Loading models...</p>;
    }

    return (
        <div className="grid gap-2">
            <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                    <Label htmlFor="model">Model</Label>
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
                    The model which will generate the completion. Some models are suitable for natural language tasks,
                    others specialize in code. Learn more.
                </HoverCardContent>
            </HoverCard>
            <Popover open={open} onOpenChange={setOpen} {...props}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a model"
                        className="w-full justify-between">
                        {selectedModel ? selectedModel.name : 'Select a model...'}
                        <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[250px] p-0">
                    <HoverCard>
                        <HoverCardContent side="left" align="start" forceMount className="min-h-[280px]">
                            {peekedModel && (
                                <div className="grid gap-2">
                                    <h4 className="font-medium leading-none">{peekedModel.name}</h4>
                                    <div className="text-sm text-muted-foreground">{peekedModel.description}</div>
                                    {peekedModel.provider && (
                                        <div className="mt-4 grid gap-2">
                                            <h5 className="text-sm font-medium leading-none">Provider</h5>
                                            <div className="text-sm text-muted-foreground">
                                                {peekedModel.provider.provider} ({peekedModel.provider.modelType})
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </HoverCardContent>
                        <Command loop>
                            <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                                <CommandInput placeholder="Search Models..." />
                                <CommandEmpty>No Models found.</CommandEmpty>
                                <HoverCardTrigger />
                                {[...new Set(models.map((m) => m.type))].map((type) => (
                                    <CommandGroup key={type} heading={type}>
                                        {models
                                            .filter((model) => model.type === type)
                                            .map((model) => (
                                                <ModelItem
                                                    key={model.id}
                                                    model={model}
                                                    isSelected={selectedModel?.id === model.id}
                                                    onPeek={(model) => setPeekedModel(model)}
                                                    onSelect={() => {
                                                        setSelectedModel(model);
                                                        onModelSelect(model);
                                                        setOpen(false);
                                                        console.log('Selected Model:', model);
                                                    }}
                                                />
                                            ))}
                                    </CommandGroup>
                                ))}
                            </CommandList>
                        </Command>
                    </HoverCard>
                </PopoverContent>
            </Popover>
        </div>
    );
}

interface ModelItemProps {
    model: Model;
    isSelected: boolean;
    onSelect: () => void;
    onPeek: (model: Model) => void;
}

function ModelItem({ model, isSelected, onSelect, onPeek }: ModelItemProps) {
    const ref = React.useRef<HTMLDivElement>(null);

    useMutationObserver(ref, (mutations) => {
        mutations.forEach((mutation) => {
            if (
                mutation.type === 'attributes' &&
                mutation.attributeName === 'aria-selected' &&
                ref.current?.getAttribute('aria-selected') === 'true'
            ) {
                onPeek(model);
            }
        });
    });

    return (
        <CommandItem
            key={model.id}
            onSelect={onSelect}
            ref={ref}
            className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground">
            {model.name}
            <CheckIcon className={cn('ml-auto h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
        </CommandItem>
    );
}
