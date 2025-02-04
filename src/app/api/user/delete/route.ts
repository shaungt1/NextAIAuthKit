import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authoptions/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * DELETE /api/user/delete/route.ts
 * Deletes the authenticated user from the database.
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.error('[Delete User] Unauthorized request.');
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    console.log('[Delete User] Deleting user:', session.user.email);

    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return NextResponse.json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    console.error('[Delete User] Error:', error.message || error);
    return NextResponse.json({ message: 'Failed to delete user.' }, { status: 500 });
  }
}
