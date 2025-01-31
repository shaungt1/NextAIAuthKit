import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  try {
    const { userId, geodata } = await request.json();

    if (!userId || !geodata) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { geodata }, // Save the stringified JSON
    });

    return NextResponse.json({ message: 'Geodata updated successfully', user: updatedUser });
  } catch (error) {
    console.error('[Update Geodata API Error]:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: (error as any).message }, { status: 500 });
  }
}
