import { PrismaClient } from '@prisma/client';

// Ensure Prisma is only instantiated once
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();
// Debugging: Log available models
console.log('Available Prisma Models:', Object.keys(prisma));

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
