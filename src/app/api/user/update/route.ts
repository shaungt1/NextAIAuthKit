import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: Request): Promise<Response> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            console.error('[Update User] Unauthorized request.');
            return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
        }

        const body = await req.json();

        // Allowed fields for update
        const allowedFields: (keyof Prisma.UserUpdateInput)[] = [
            'name',
            'profileImage',
            'phone',
            'title',
            'bio',
            'facebook',
            'instagram',
            'twitter',
            'youtube',
            'linkedin',
            'website',
            'latitude',
            'longitude',
            'ipAddress',
        ];

        // Filter and validate `updateData`
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
            console.error('[Update User] No valid fields provided for update.');
            return NextResponse.json(
                { message: 'No valid fields provided for update.' },
                { status: 400 }
            );
        }

        console.log('[Update User] Updating user:', session.user.email, updateData);

        // Update user in the database
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
        });

        return NextResponse.json({
            message: 'User updated successfully.',
            user: updatedUser,
        });
    } catch (error: any) {
        console.error('[Update User] Error:', error.message);
        return NextResponse.json(
            { message: 'Failed to update user.', error: error.message },
            { status: 500 }
        );
    }
}
