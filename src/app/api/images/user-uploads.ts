// import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { prisma } from '@/app/lib/prisma';

/**
 * POST /api/images/user-uploads
 * Uploads a user image (e.g., drawings, emojis, icons).
 */
export async function POST(req: Request) {
  const { userId, image, type, fileName } = await req.json(); // Expect Base64 image data from frontend

  if (!image || !userId || !type) {
    return NextResponse.json({ message: 'User ID, image, and type are required.' }, { status: 400 });
  }

  try {
    const newImage = await prisma?.userImages.create({
      data: {
        userId,
        type,
        data: Buffer.from(image, 'base64'),
        fileName,
      },
    });

    return NextResponse.json({
      message: 'Image uploaded successfully.',
      imageId: newImage.id,
    });
  } catch (error) {
    console.error('[Upload User Image Error]:', (error as any).message);
    return NextResponse.json({ message: 'Failed to upload image.' }, { status: 500 });
  }
}
