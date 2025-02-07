import { PrismaClient } from '@prisma/client';
//  Run this comand : node assignAdmin.ts
//  Assign Email Privallges to a User
const adminEmail = 'shaunpritchard5@gmail.com'; // Change to the desired user email
const prisma = new PrismaClient();

async function makeAdmin() {
    const email = adminEmail; 

    const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });

    console.log('✅ Admin role assigned:', updatedUser);
}

makeAdmin()
    .catch((error) => console.error('❌ Error assigning admin role:', error))
    .finally(() => prisma.$disconnect());
