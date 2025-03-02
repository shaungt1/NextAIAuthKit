import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authoptions/authOptions';
// const prisma = new PrismaClient();
import { prisma } from '@/app/lib/prisma';

/**
 * PATCH /api/user/update-profile
 * Handles updates to the user profile, including `Bytes` type handling for `profileImage`.
 */
export async function PATCH(req: Request): Promise<Response> {
    try {
        const session = await getServerSession(authOptions);

        // Ensure the user is authenticated
        if (!session?.user?.email) {
            console.warn('[Update Profile API]: Unauthorized access attempt.');
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Define allowed fields for update
        const allowedFields: (keyof Prisma.UserUpdateInput)[] = [
            'name',
            'latitude',
            'longitude',
            'location',
            'ipAddress',
            'geodata',
            'phone',
            'title',
            'bio',
            'facebook',
            'instagram',
            'twitter',
            'youtube',
            'linkedin',
            'website',
        ];

        // Filter and validate fields
        const updateData: Prisma.UserUpdateInput = {};
           
        for (const key of allowedFields) {
            if (key in body) {
                const value = body[key];
                if (value === undefined || value === null || value === '') {
                    // Skip null, undefined, or empty values for updates
                    continue;
                }
                // Prisma requires strict types; ensure the types are correct
                if (
                    key === 'latitude' ||
                    key === 'longitude'
                ) {
                    if (typeof value === 'number') {
                        updateData[key] = value;
                    }
                } else if (typeof value === 'string') {
                    updateData[key] = value;
                }
            }
        }

        if (Object.keys(updateData).length === 0) {
            console.warn('[Update Profile API]: No valid fields provided for update.');
            return NextResponse.json({ message: 'No valid fields provided for update.' }, { status: 400 });
        }

        console.log(`[Update Profile API]: Updating user ${session.user.email} with data:`, updateData);

        // Update user in the database
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
        });

        return NextResponse.json({
            message: 'Profile updated successfully.',
            user: updatedUser,
        });
    } catch (error: any) {
        console.error('[Update Profile API Error]:', error.message);
        return NextResponse.json(
            { message: 'Failed to update profile.', error: error.message },
            { status: 500 }
        );
    }
}
