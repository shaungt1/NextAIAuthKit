/**
 * Admin API Route
 * - Provides protected access to admin functionality.
 * - Includes role-based authorization and robust error handling.
 * - Fetches all users for administrative purposes (example functionality).
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authoptions/authOptions';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import { prisma } from '@/app/lib/prisma';

/**
 * Handles GET requests for admin actions.
 * - Protected route, only accessible by ADMIN users.
 * - Example: Fetch all users from the database.
 */
export async function GET(req: Request) {
  try {
    console.log('[Admin API] Processing GET request...');

    // Get the server session to validate user
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      console.error('[Admin API] Unauthorized access attempt. Admin role required.');
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    console.log('[Admin API] Admin access granted for:', session.user.email);

    // Example action: Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`[Admin API] Retrieved ${users.length} users.`);

    return NextResponse.json({ message: 'Users fetched successfully.', users }, { status: 200 });
  } catch (error: any) {
    console.error('[Admin API] Error processing GET request:', error.message || error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * Handles DELETE requests for admin actions.
 * - Example: Delete a user by ID.
 */
export async function DELETE(req: Request) {
  try {
    console.log('[Admin API] Processing DELETE request...');

    // Get the server session to validate user
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      console.error('[Admin API] Unauthorized delete attempt. Admin role required.');
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      console.error('[Admin API] Missing user ID in DELETE request.');
      return NextResponse.json(
        { message: 'User ID is required for deletion.' },
        { status: 400 }
      );
    }

    // Attempt to delete the user
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    console.log('[Admin API] Successfully deleted user:', deletedUser.email);

    return NextResponse.json(
      { message: `User with ID ${userId} deleted successfully.`, user: deletedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Admin API] Error processing DELETE request:', error.message || error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * Handles POST requests for admin actions.
 * - Example: Create a new admin user.
 */
export async function POST(req: Request) {
  try {
    console.log('[Admin API] Processing POST request...');

    // Get the server session to validate user
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      console.error('[Admin API] Unauthorized create attempt. Admin role required.');
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      console.error('[Admin API] Missing required fields in POST request.');
      return NextResponse.json(
        { message: 'Email, name, and password are required.' },
        { status: 400 }
      );
    }

    const bcrypt = (await import('bcrypt')).default;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('[Admin API] New admin created:', newAdmin.email);

    return NextResponse.json(
      { message: 'Admin created successfully.', user: newAdmin },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Admin API] Error processing POST request:', error.message || error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * Exported API methods:
 * - GET: Fetch all users (admin-only).
 * - DELETE: Delete a user by ID (admin-only).
 * - POST: Create a new admin user.
 */
