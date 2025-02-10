import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Ensure Prisma is correctly set up

/**
 * Handles saving or updating conversation data.
 * @param {Request} req - The request object from the client.
 * @returns {Response} JSON response with the saved conversation or error message.
 */
export async function POST(req: Request) {
    try {
        // Parse the request body
        const { conversationId, userId, conversationData } = await req.json();

        // Validate required fields
        if (!conversationId || !userId || !conversationData) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
            return NextResponse.json(updatedConversation, { status: 200 });
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
            return NextResponse.json(newConversation, { status: 201 });
        }
    } catch (error) {
        console.error("❌ Error saving conversation:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
