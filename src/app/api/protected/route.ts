import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authoptions/authOptions';
import { NextResponse } from 'next/server';

/**
 * Protect Admin Routes
 * - Enforces admin-only access.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    if (!session || session.user.role !== 'ADMIN') {
      console.error('[Admin API] Access denied. Admin role required.');
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    console.log('[Admin API] Access granted for admin user:', session.user.email);
    return NextResponse.json({ message: 'Welcome, Admin!' });
  } catch (error) {
    console.error('[Admin API] Error processing request:', (error as Error).message);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
