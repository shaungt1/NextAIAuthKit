/**
 * NextAuth Configuration for Authentication and Authorization
 * - Supports Google SSO and email/password credentials.
 * - Uses PrismaAdapter for database operations with Prisma Client.
 * - Implements error handling and TypeScript typings.
 * - Adds role management for users and JWT strategy.
 * - Automatically signs up new Google SSO users.
 * - Adds provider tracking to session and JWT callbacks.
 */

import NextAuth from "next-auth";
import { authOptions } from '@/app/api/authoptions/authOptions';
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";

// import { prisma } from '@src/lib/prisma';
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string | null;
      provider: string | null; // Add provider to session user
    };
  }

  interface JWT {
    id: string;
    role: string;
    provider: string | null; // Add provider to JWT
  }
}

// Explicitly export named handlers for app directory
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
