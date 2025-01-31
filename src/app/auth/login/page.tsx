/**
 * Login Page Component
 * - Entry point for user login.
 * - Uses NextAuth for authentication with Google SSO and credentials.
 * - Styled with ShadCN UI and Tailwind.
 */

import { Metadata } from "next";
import Link from "next/link";
// import { UserAuthForm } from "@/app/auth/signup/user-auth-signup-form";
import { LoginForm } from "./LoginForm";



// Metadata for SEO and browser titles
export const metadata: Metadata = {
  title: "Login",
  description: "Log in to access your account",
};

// Login Page Component
const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-6 py-12 shadow-lg dark:shadow-zinc-800">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials or sign in with Google.
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-primary underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;





