import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  const { userId, offsetX, offsetY, zoom, profileImage } = await req.json();

  console.log('[API Save Image Adjustments] Request Data:', { userId, offsetX, offsetY, zoom }); // Debug log

  if (!userId || offsetX === undefined || offsetY === undefined || zoom === undefined || !profileImage) {
    return NextResponse.json({ message: 'Invalid request data.' }, { status: 400 });
  }

  try {
    // Update the user's image and adjustments
    await prisma.user.update({
      where: { id: userId },
      data: {
        imageOffsetX: offsetX,
        imageOffsetY: offsetY,
        imageZoom: zoom,
        profileImage: Buffer.from(profileImage.split(',')[1], 'base64'), // Store as a BLOB
      },
    });

    console.log('[API Save Image Adjustments] Success: Adjustments saved'); // Debug success log
    return NextResponse.json({ message: 'Profile image and adjustments saved successfully.' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[API Save Image Adjustments Error]:', error.message);
    } else {
      console.error('[API Save Image Adjustments Error]:', error);
    }
    return NextResponse.json({ message: 'Failed to save profile image and adjustments.' }, { status: 500 });
  }
}
