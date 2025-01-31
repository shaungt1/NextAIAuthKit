import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Handles user sign-up logic:
 * - Supports Google SSO and Email/Password signup flows.
 * - Ensures users are added to the database with appropriate provider details.
 */
const validRoles = ["USER", "ADMIN", "GROUP_OWNER","GROUP_MEMBER", "MOD"]; // Define valid roles
export async function POST(req: Request) {
  try {
    console.log('[SignUp API] Signup request received.');

    const body = await req.json();
    const { email, password, provider, providerAccountId, role } = body;

    if (!email || (provider === 'credentials' && !password)) {
      console.error('[SignUp API] Missing required fields.');
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.warn('[SignUp API] User already exists:', email);
      return NextResponse.json({ message: 'User already exists.' }, { status: 400 });
    }

    let user;

    if (provider === 'google') {
      // Create a user and associated account for Google SSO
      if (!providerAccountId) {
        console.error('[SignUp API] Missing providerAccountId for Google SSO.');
        return NextResponse.json({ message: 'Provider account ID is required for Google SSO.' }, { status: 400 });
      }

      user = await prisma.user.create({
        data: {
          email,
          role: role || "USER", 
          name: null, // Name will be updated during the SSO callback
          image: null, // Profile picture will be updated during the SSO callback
          accounts: {
            create: {
              provider: 'google',
              providerAccountId,
            },
          },
        },
      });
      console.log('[SignUp API] Google user created:', user.email);
    } else if (provider === 'credentials') {
      // Create a user for email/password auth
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || "USER",
        },
      });
      console.log('[SignUp API] Credentials user created:', user.email);
    } else {
      console.error('[SignUp API] Invalid provider:', provider);
      return NextResponse.json({ message: 'Invalid provider.' }, { status: 400 });
    }

    // Send a success response with user details (excluding sensitive information)
    return NextResponse.json({
      message: 'Signup successful.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('[SignUp API] Error:', error.message || error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
