import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { prisma } from '@/app/lib/prisma';

/**
 * PATCH /api/user/profile-image
 * Uploads or updates the profile image of a user.
 */
export async function PATCH(req: Request) {
  const { userId, image } = await req.json(); // Expect Base64 image data from frontend

  if (!image || !userId) {
    return NextResponse.json({ message: 'User ID and image are required.' }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: Buffer.from(image, 'base64') },
    });

    return NextResponse.json({ message: 'Profile image updated successfully.' });
  } catch (error) {
    console.error('[Update Profile Image Error]:', (error as any).message);
    return NextResponse.json({ message: 'Failed to update profile image.' }, { status: 500 });
  }
}

/**
 * GET /api/user/profile-image
 * Retrieves the profile image of a user.
 */
export async function GET(req: Request) {
    const { userId } = await req.json();
  
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { profileImage: true },
      });
  
      return NextResponse.json({
        profileImage: user?.profileImage
          ? `data:image/png;base64,${Buffer.from(user.profileImage).toString('base64')}`
          : null,
      });
    } catch (error) {
      console.error('[Retrieve Profile Image Error]:', (error as any).message);
      return NextResponse.json({ message: 'Failed to retrieve profile image.' }, { status: 500 });
    }
  }
  