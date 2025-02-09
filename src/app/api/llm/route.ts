import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/middleware';

// Handle GET requests (Fetch all LLMs)
export async function GET() {
    try {
        const llms = await prisma.lLM.findMany({
            include: { models: true },
        });
        return NextResponse.json(llms, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching LLMs:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST requests (Create new LLM)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, provider, version, type, temperature, maxTokens, topP, frequencyPenalty, presencePenalty, models } = body;

        const newLLM = await prisma.lLM.create({
            data: {
                name,
                description,
                provider,
                version,
                type,
                temperature,
                maxTokens,
                topP,
                frequencyPenalty,
                presencePenalty,
                models: {
                    create: models.map((model: any) => ({
                        name: model.name,
                        description: model.description,
                        inputCost: model.inputCost,
                        outputCost: model.outputCost,
                    })),
                },
            },
            include: { models: true },
        });

        return NextResponse.json(newLLM, { status: 201 });
    } catch (error) {
        console.error("❌ Error creating LLM:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
