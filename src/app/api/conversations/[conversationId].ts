import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { conversationId, userId, conversationData } = req.body;

        if (!conversationId || !userId || !conversationData) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log("📜 RECEIVED CONVERSATION DATA:", { conversationId, userId, conversationData });

        // 🔹 Check if conversation exists
        const existingConversation = await prisma.conversation.findUnique({
            where: { conversationId },
        });

        if (existingConversation) {
            // 🔹 Update existing conversation
            const updatedConversation = await prisma.conversation.update({
                where: { conversationId },
                data: {
                    conversationData,
                    updatedAt: new Date(),
                },
            });

            console.log("✅ Conversation updated in database:", updatedConversation);
            return res.status(200).json(updatedConversation);
        } else {
            // 🔹 Create a new conversation entry
            const newConversation = await prisma.conversation.create({
                data: {
                    conversationId,
                    userId,
                    conversationData,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            console.log("✅ New conversation saved:", newConversation);
            return res.status(201).json(newConversation);
        }
    } catch (error) {
        console.error("❌ Error saving conversation:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
