'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

/**
 * Settings Page Component
 * - Protected route only accessible to authenticated users.
 * - Allows users to delete their account or update their profile information.
 */
export default function SettingsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/login';
    },
  });

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    image: session?.user?.image || '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/delete', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete account.');
      
      setMessage('Account deleted successfully. Redirecting...');
      signOut({ callbackUrl: '/' });
    } catch (error: any) {
      setMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdateProfile(event: React.FormEvent) {
    event.preventDefault();
    setIsUpdating(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update profile.');

      setMessage('Profile updated successfully.');
    } catch (error: any) {
      setMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  }

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className="settings-page">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p>Manage your account and profile information here.</p>

      <form onSubmit={handleUpdateProfile} className="profile-form">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <label htmlFor="image">Profile Picture URL</label>
        <input
          id="image"
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />

        <button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <button onClick={handleDeleteAccount} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete Account'}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
