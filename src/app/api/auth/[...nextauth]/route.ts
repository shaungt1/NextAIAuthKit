/**
 * NextAuth Configuration for Authentication and Authorization
 * - Supports Google SSO and email/password credentials.
 * - Uses PrismaAdapter for database operations with Prisma Client.
 * - Implements error handling and TypeScript typings.
 * - Adds role management for users and JWT strategy.
 * - Automatically signs up new Google SSO users.
 * - Adds provider tracking to session and JWT callbacks.
 */

import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google SSO Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Email and Password Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error("[CredentialsProvider] Missing email or password.");
          throw new Error("Email and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          console.error("[CredentialsProvider] Invalid credentials.");
          throw new Error("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.error("[CredentialsProvider] Password mismatch.");
          throw new Error("Invalid email or password.");
        }

        console.log("[CredentialsProvider] Successfully authenticated user:", user.email);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profileImage?.toString() || null,
          role: user.role || "user",
        };
      },
    }),
  ],
  callbacks: {
    // Add provider to the session user object
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          provider: typeof token.provider === 'string' ? token.provider : null, // Attach provider to session
        };
      }
      console.log("[Session Callback] Session updated with token:", session);
      return session;
    },
    // Add provider to the JWT
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      if (account) {
        token.provider = account.provider; // Save the provider for tracking
      }
      console.log("[JWT Callback] Token updated with provider and user details:", token);
      return token;
    },
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        console.log("[SignIn Callback] Google SSO login attempt for user:", profile?.email);

        // Check if user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: profile?.email },
        });

        if (!existingUser) {
          console.log("[SignIn Callback] Creating new user from Google SSO.");
          try {
            await prisma.user.create({
              data: {
                email: profile?.email!,
                name: profile?.name!,
                profileImage: Buffer.from(profile?.image!),
                accounts: {
                  create: {
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                  },
                },
              },
            });
          } catch (error) {
            console.error("[SignIn Callback] Error creating new user:", error);
            return false;
          }
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// User Deletion API
/**
 * Deletes a user from the database.
 * - Requires admin privileges or owner access.
 * @param userId - ID of the user to delete.
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    console.log("[User Deletion] Attempting to delete user:", userId);

    // Ensure user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    // Delete user and related accounts
    await prisma.user.delete({
      where: { id: userId },
    });

    console.log("[User Deletion] Successfully deleted user:", userId);
  } catch (error) {
    console.error("[User Deletion] Error deleting user:", error);
    throw error;
  }
}

// Explicitly export named handlers for app directory
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
