import { NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';


export async function POST(req: Request) {
    try {
        const requestBody = await req.json();
        console.log("🔹 Received API Request Body:", requestBody);

        const { name, description, modelId, temperature, maxTokens, topP, frequencyPenalty, presencePenalty, prompt } = requestBody;

        if (!modelId || isNaN(modelId)) {
            console.error("❌ Error: Model ID is invalid or missing.");
            return NextResponse.json({ error: "Invalid Model ID" }, { status: 400 });
        }

        console.log("🔍 Looking up model with ID:", modelId);

        // ✅ Lookup the model using the correct ID (instead of name)
        const model = await prisma.model.findUnique({
            where: { id: modelId }  // ✅ Corrected to lookup by `id`
        });

        console.log("🔎 Model Lookup Result:", model);

        if (!model) {
            console.error("❌ Model not found:", modelId);
            return NextResponse.json({ error: "Invalid Model ID" }, { status: 400 });
        }

        console.log("✅ Found Model:", { id: model.id, name: model.name });

        // ✅ Use the actual model.id when saving the preset
        const preset = await prisma.preset.create({
            data: {
                name,
                description,
                modelId: model.id, // Use the actual ID from the model lookup
                temperature,
                maxTokens,
                topP,
                frequencyPenalty,
                presencePenalty,
                prompt,
            },
        });

        console.log("✅ Preset Created Successfully:", preset);
        return NextResponse.json(preset, { status: 201 });
    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}





export async function GET() {
    try {
        const presets = await prisma.preset.findMany({
            include: { model: true }, // ✅ Include model info in response
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(presets, { status: 200 });
    } catch (error) {
        console.error("Error fetching presets:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
