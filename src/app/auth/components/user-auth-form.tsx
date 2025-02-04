/**
 * UserAuthForm Component
 * - Provides a login form for email/password authentication.
 * - Includes Google SSO button.
 */

"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Icons } from "@/utils/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// User Authentication Form Component
export const UserAuthForm: React.FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleGoogleSignIn() {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    // Placeholder for email/password login handling
    console.log("Email/Password login submitted");
  }

  return (
    <div className={`grid gap-6 ${className}`} {...props}>
      {/* Email/Password Login */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 animate-spin" />}
            Log In with Email
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Sign-In */}
      <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 animate-spin" />
        ) : (
          <Icons.google className="mr-2" />
        )}
        Sign In with Google
      </Button>
    </div>
  );
};
