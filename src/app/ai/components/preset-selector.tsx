import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/registry/new-york/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { PopoverProps } from "@radix-ui/react-popover";

interface Preset {
    id: string;
    name: string;
    description?: string;
}

interface PresetSelectorProps extends PopoverProps {
    presets: Preset[];  // ✅ Now accepts presets as a prop
    onPresetSelect: (preset: Preset) => void;
}

export function PresetSelector({ presets, onPresetSelect, ...props }: PresetSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedPreset, setSelectedPreset] = React.useState<Preset | null>(null);
    const router = useRouter();

    return (
        <Popover open={open} onOpenChange={setOpen} {...props}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Load a preset..."
                    aria-expanded={open}
                    className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
                >
                    {selectedPreset ? selectedPreset.name : "Load a preset..."}
                    <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search presets..." />
                    <CommandList>
                        <CommandEmpty>No presets found.</CommandEmpty>
                        <CommandGroup heading="Saved Presets">
                            {presets.map((preset) => (
                                <CommandItem
                                    key={preset.id}
                                    onSelect={() => {
                                        setSelectedPreset(preset);
                                        setOpen(false);
                                        onPresetSelect(preset);
                                    }}
                                >
                                    {preset.name}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedPreset?.id === preset.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
