import { PrismaClient } from '@prisma/client';

// Run this command: node assignAdmin.ts
// Assign Admin Privileges to a User

const prisma = new PrismaClient();

// Dummy user data (replace with actual values as needed)
const userData = {
    id: '427012eb-878b-45a7-b146-14035a6b1b15',
    email: 'shaunpritchard5@gmail.com', // Change to target user
    name: 'Shaun Pritchard',
    password: '$2b$10$UQfwvTHew1ZTY/B15Om0xeCq/6X.SkjZSbqGXuF5t9hkmSM5B3ldW',
    profileImage: 'https://example.com/default-profile.jpg',
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageZoom: 1,
    role: 'ADMIN',
    location: 'Tampa, FL',
    latitude: 27.9506,
    longitude: -82.4572,
    ipAddress: '192.168.1.1',
    geodata: JSON.stringify({ city: 'Tampa', country: 'USA' }),
    phone: '+1-555-1234-567',
    bio: 'Veteran, AI Engineer, and Content Creator.',
    title: 'Chief AI Engineer',
    facebook: 'https://facebook.com/shaunpritchard',
    instagram: 'https://instagram.com/shaunpritchard',
    twitter: 'https://twitter.com/shaunpritchard',
    youtube: 'https://youtube.com/@shaunpritchard',
    linkedin: 'https://linkedin.com/in/shaunpritchard',
    website: 'https://shaunpritchard.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    image: 'https://example.com/user-profile.jpg',
};

async function updateUser() {
    try {
        const updatedUser = await prisma.user.upsert({
            where: { email: userData.email },
            update: userData,
            create: userData,
        });

        console.log('✅ User updated successfully:', updatedUser);
    } catch (error) {
        console.error('❌ Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateUser();
