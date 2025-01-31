import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

/**
 * API Route: GET /api/user/profile-data
 * Purpose: Fetch user profile data from the database based on the session.
 * Authentication: Requires the user to be authenticated.
 * 
 * Response:
 * - 200: Returns the user profile data as JSON.
 * - 401: Unauthorized if the session is missing or invalid.
 * - 404: User not found in the database.
 * - 500: Internal server error for unexpected issues.
 */
export async function GET() {
  try {
    console.log('[Profile Data API]: Fetching server session');
    const session = await getServerSession(authOptions);

    // Check if the session exists and contains a valid email
    if (!session?.user?.email) {
      console.warn('[Profile Data API Warning]: Unauthorized access attempt');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[Profile Data API]: Session validated for email: ${session.user.email}`);

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.warn(`[Profile Data API Warning]: User not found for email: ${session.user.email}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log(`[Profile Data API]: Successfully retrieved user data for email: ${session.user.email}`);

    // Return the user profile data
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      latitude: user.latitude,
      longitude: user.longitude,
      ipAddress: user.ipAddress,
      geodata: user.geodata,
      phone: user.phone,
      bio: user.bio,
      title: user.title,
      facebook: user.facebook,
      instagram: user.instagram,
      twitter: user.twitter,
      youtube: user.youtube,
      linkedin: user.linkedin,
      website: user.website,
      profileImage: user.profileImage,
      imageOffsetX: user.imageOffsetX,
      imageOffsetY: user.imageOffsetY,
      imageZoom: user.imageZoom,
      createdAt: user.createdAt,

    });
  } catch (error: any) {
    // Log the error details for debugging
    console.error('[Profile Data API Error]:', error.message);
    if (error instanceof SyntaxError) {
      console.error('[Profile Data API Error]: Invalid JSON format');
    } else if (error instanceof TypeError) {
      console.error('[Profile Data API Error]: Type issue detected');
    } else {
      console.error('[Profile Data API Error]: Unknown error occurred');
    }

    // Return a 500 Internal Server Error
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
