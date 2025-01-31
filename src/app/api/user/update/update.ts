import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PATCH /api/user/update
 * Updates the authenticated user's profile information.
 */
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.error('[Update User] Unauthorized request.');
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();

    // Extract and validate fields
    const {
      name,
      profileImage,
      phone,
      title,
      bio,
      facebook,
      instagram,
      twitter,
      youtube,
      linkedin,
      website,
      latitude,
      longitude,
      ipAddress,
    } = body;

    console.log('[Update User] Updating user:', session.user.email);

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        profileImage,
        phone,
        title,
        bio,
        facebook,
        instagram,
        twitter,
        youtube,
        linkedin,
        website,
        latitude,
        longitude,
        ipAddress,
      },
    });

    return NextResponse.json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error: any) {
    console.error('[Update User] Error:', error.message || error);
    return NextResponse.json({ message: 'Failed to update user.' }, { status: 500 });
  }
}




/**
 * PATCH /api/user/update
 * Updates the authenticated user's profile information.
 */
export async function PATCHGENRAL(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.error('[Update User] Unauthorized request.');
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, profileImage } = body;

    console.log('[Update User] Updating user:', session.user.email);

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, profileImage },
    });

    return NextResponse.json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error: any) {
    console.error('[Update User] Error:', error.message || error);
    return NextResponse.json({ message: 'Failed to update user.' }, { status: 500 });
  }
}