// File: src\app\api\user\profile-image\route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/authoptions/authOptions';

const prisma = new PrismaClient();

/**
 * PATCH: Updates the user's profile image.
 * @description Receives a Base64 image from the client, converts it to a BLOB, and stores it in the database.
 */
export async function PATCH(req: Request) {
  // Get the authenticated user's session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { image } = await req.json();

    // Validate the Base64 image
    if (!image || !/^data:image\/\w+;base64,/.test(image)) {
      return NextResponse.json({ message: 'Invalid image format.' }, { status: 400 });
    }

    // Convert Base64 to binary for storage in SQLite
    const binaryImage = Buffer.from(image.split(',')[1], 'base64');

    // Update the user's profile image in the database
    await prisma.user.update({
      where: { email: session.user.email as string },
      data: { profileImage: binaryImage },
    });

    return NextResponse.json({ message: 'Profile image updated successfully.' });
  } catch (error) {
    console.error('[Update Profile Image Error]:', error);
    return NextResponse.json({ message: 'Failed to update profile image.' }, { status: 500 });
  }
}

/**
 * GET: Retrieves the user's profile image.
 * @description Fetches the image as a BLOB from the database and returns it as a Base64 string.
 */
export async function GET() {
  // Get the authenticated user's session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Retrieve the user's profile image
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { profileImage: true },
    });

    if (!user || !user.profileImage) {
      return NextResponse.json({ profileImage: null });
    }

    // Convert the BLOB back to Base64 for the frontend
    const base64Image = `data:image/png;base64,${Buffer.from(user.profileImage).toString('base64')}`;
    return NextResponse.json({ profileImage: base64Image });
  } catch (error) {
    console.error('[Retrieve Profile Image Error]:', error);
    return NextResponse.json({ message: 'Failed to retrieve profile image.' }, { status: 500 });
  }
}
