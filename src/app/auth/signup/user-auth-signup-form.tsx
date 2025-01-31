'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';
import { Label } from '@/registry/new-york/ui/label';

/**
 * User Authentication Sign-Up Form
 * - Handles user sign-up with Google SSO and email/password.
 * - Redirects based on sign-up flow: Profile page for Google, Login page for credentials.
 * - Implements robust error handling and logging for better debugging.
 */
export function UserAuthSignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handles email/password sign-up flow
   * - Submits data to API and redirects to login on success.
   */
  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('[SignUpForm] Attempting email/password sign-up...');
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, provider: 'credentials' }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[SignUpForm] Sign-up API error:', error.message);
        throw new Error(error.message || 'Sign-up failed.');
      }

      console.log('[SignUpForm] Credentials sign-up successful. Redirecting to login...');
      window.location.href = '/auth/login';
    } catch (error: any) {
      console.error('[SignUpForm] Error during credentials sign-up:', error.message || error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handles Google SSO sign-up flow
   * - Signs in user with Google and redirects to profile on success.
   */
  async function handleGoogleSignIn() {
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('[SignUpForm] Initiating Google SSO sign-up...');
      const result = await signIn('google', { redirect: false, callbackUrl: '/profile' });

      if (result?.error) {
        console.error('[SignUpForm] Google SSO error:', result.error);
        throw new Error(result.error || 'Google SSO failed.');
      }

      console.log('[SignUpForm] Google SSO successful. Redirecting to profile...');
      if (result && result.url) window.location.href = result.url;
    } catch (error: any) {
      console.error('[SignUpForm] Error during Google SSO sign-up:', error.message || error);
      setErrorMessage(error.message || 'Failed to sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign Up'}
          </Button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </form>
      <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign Up with Google'}
      </Button>
    </div>
  );
}
