'use client';

import * as React from 'react';
import { toast } from '@/registry/new-york/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/registry/new-york/ui/alert-dialog';
import { Button } from '@/registry/new-york/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/registry/new-york/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

interface Preset {
    id: number;
    name: string;
    description?: string;
}

interface PresetActionsProps {
    selectedPreset: Preset | null;
    onDeletePreset: (deletedPresetId: number) => void;
}

export function PresetActions({ selectedPreset, onDeletePreset }: PresetActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        console.log("📌 Current selectedPreset in PresetActions:", selectedPreset);
    }, [selectedPreset]);

    const handleDeletePreset = async () => {
        console.log("🗑️ Attempting to delete preset:", selectedPreset);

        if (!selectedPreset) {
            console.warn("⚠️ No preset selected for deletion!");
            return;
        }

        try {
            const response = await fetch(`/api/presets/${selectedPreset.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("✅ Preset deleted successfully:", selectedPreset.id);

                // ✅ Remove deleted preset from UI state
                onDeletePreset(selectedPreset.id);

                // ✅ Show success message
                toast({
                    description: `Preset "${selectedPreset.name}" has been deleted.`,
                });
            } else {
                const errorResponse = await response.json();
                console.error("❌ Failed to delete preset:", errorResponse);
                toast({
                    description: "Failed to delete preset. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("❌ Error deleting preset:", error);
            toast({
                description: "An error occurred while deleting the preset.",
                variant: "destructive",
            });
        } finally {
            setShowDeleteDialog(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='secondary'>
                        <span className='sr-only'>Actions</span>
                        <DotsHorizontalIcon className='size-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem onSelect={() => setIsOpen(true)}>Content filter preferences</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onSelect={() => {
                            console.log("🗑️ Delete button clicked, setting delete dialog to true.");
                            setShowDeleteDialog(true);
                        }} 
                        className='text-red-600'
                    >
                        Delete preset
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This preset will no longer be accessible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant='destructive'
                            onClick={handleDeletePreset} // ✅ Correctly invokes function
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
