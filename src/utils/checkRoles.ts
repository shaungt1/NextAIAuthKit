import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserRoles() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true },
    });

    console.log('🔍 All Users and Roles:', users);
}

checkUserRoles()
    .catch((error) => console.error('❌ Error fetching user roles:', error))
    .finally(() => prisma.$disconnect());
