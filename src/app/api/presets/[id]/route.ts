import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const presetId = parseInt(id, 10);

        if (isNaN(presetId)) {
            return NextResponse.json({ error: "Invalid preset ID" }, { status: 400 });
        }

        const preset = await prisma.preset.findUnique({
            where: { id: presetId },
            include: { model: true } // ✅ Fetch associated model
        });

        if (!preset) {
            return NextResponse.json({ error: "Preset not found" }, { status: 404 });
        }

        return NextResponse.json(preset, { status: 200 });
    } catch (error) {
        console.error("Error fetching preset:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const presetId = parseInt(id, 10);

        if (isNaN(presetId)) {
            return NextResponse.json({ error: "Invalid preset ID" }, { status: 400 });
        }

        const updateData = await req.json();

        const preset = await prisma.preset.update({
            where: { id: presetId },
            data: updateData,
        });

        return NextResponse.json(preset, { status: 200 });
    } catch (error) {
        console.error("Error updating preset:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const presetId = parseInt(id, 10);

        if (isNaN(presetId)) {
            return NextResponse.json({ error: "Invalid preset ID" }, { status: 400 });
        }

        const presetExists = await prisma.preset.findUnique({
            where: { id: presetId },
        });

        if (!presetExists) {
            return NextResponse.json({ error: "Preset not found" }, { status: 404 });
        }

        await prisma.preset.delete({
            where: { id: presetId },
        });

        return NextResponse.json({ message: "Preset deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ Error deleting preset:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
