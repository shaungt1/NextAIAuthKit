/**
 * NextAuth Configuration for Authentication and Authorization
 * - Supports Google SSO and email/password credentials.
 * - Uses PrismaAdapter for database operations with Prisma Client.
 * - Implements error handling and TypeScript typings.
 * - Adds role management for users and JWT strategy.
 * - Automatically signs up new Google SSO users.
 * - Adds provider tracking to session and JWT callbacks.
 */

import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
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
    async session({ session, token }) {
      console.log("📢 [AUTH CALLBACK] Session Object Before:", session);
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          provider: typeof token.provider === "string" ? token.provider : null,
        };
      }
      console.log("[Session Callback] Session updated after with token:", session);
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("📢 [AUTH CALLBACK] JWT Before:", token);
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      if (account) {
        token.provider = account.provider;
      }
      console.log("[JWT Callback] Token updated with provider and user details:", token);
      return token;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        console.log("[SignIn Callback] Google SSO login attempt for user:", profile?.email);

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
