import { NextResponse } from 'next/server';

import { prisma } from '@/app/lib/prisma';


export async function GET() {
    try {
        const models = await prisma.model.findMany({
            include: {
                provider: true, 
            },
        });

        return NextResponse.json(models, { status: 200 });
    } catch (error) {
        console.error('Error fetching models:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
