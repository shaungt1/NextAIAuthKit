import { useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/registry/new-york/ui/dialog";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";

export function PresetSave({ modelId, temperature, maxTokens, topP, frequencyPenalty, presencePenalty, prompt, onPresetAdded = () => {} }: any) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); // ✅ State to manage dialog open/close

    const savePreset = async () => {
        if (!name.trim()) {
            console.warn("⚠️ Preset name is required!");
            return;
        }

        setSaving(true);

        const presetData = {
            name,
            description,
            modelId,
            temperature,
            maxTokens,
            topP,
            frequencyPenalty,
            presencePenalty,
            prompt,
        };

        console.log("🔹 Sending preset data:", presetData);

        try {
            const response = await fetch("/api/presets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(presetData),
            });

            if (response.ok) {
                const newPreset = await response.json();
                console.log("✅ Preset saved successfully:", newPreset);
                
                // ✅ Call the callback function to update the presets list
                onPresetAdded(newPreset);

                // ✅ Clear input fields after saving
                setName("");
                setDescription("");

                // ✅ Close the dialog
                setDialogOpen(false);

            } else {
                const errorResponse = await response.json();
                console.error("❌ Failed to save preset:", errorResponse);
            }
        } catch (error) {
            console.error("❌ Error saving preset:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">Save Preset</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px]">
                <DialogHeader>
                    <DialogTitle>Save Preset</DialogTitle>
                    <DialogDescription>Save the current model settings.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Preset Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={savePreset} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
