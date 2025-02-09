import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Prisma Middleware to track changes in LLM models
prisma.$use(async (params, next) => {
    if (params.model === 'LLM' && (params.action === 'create' || params.action === 'update')) {
        console.log(`🔄 Prisma Middleware Triggered: ${params.action.toUpperCase()} on LLM`);
    }
    return next(params);
});

export default prisma;
