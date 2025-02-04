import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/authoptions/authOptions';
import Link from 'next/link';


/**
 * Profile Page Component
 * - Displays user profile information after authentication.
 * - Handles session fetching and error cases robustly.
 */
export default async function ProfilePage() {
  try {
    console.log("[ProfilePage] Fetching session...");
    const session = await getServerSession(authOptions);

    console.log("[ProfilePage] Session data:", session);

    // Handle cases where session is not available
    if (!session) {
      console.warn("[ProfilePage] No active session found. Redirecting to login.");
      return (
        <div>
          <p>
            You are not logged in. <a href="/auth/login">Login</a>
          </p>
        </div>
      );
    }

    // Render the user's profile information
    return (
      <>
      <h1>Profile Page</h1>

      <div className="profile-page">
        <h1 className="text-2xl font-semibold">Welcome, {session.user?.email}</h1>
        <p>Your user ID is: {session.user?.id}</p>
        <p>Your role is: {session.user?.role}</p>
        <p>Your name is: {session.user?.name || "N/A"}</p>
        <p>Your profile picture:</p>
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt="Profile Picture"
            className="rounded-full w-24 h-24"
          />
        ) : (
          <p>No profile picture available.</p>
        )}
      </div>



      <hr></hr>
      <ul>
        <li><Link href="/auth/settings"><b>Settings</b></Link></li>
      </ul>
      </>
    );
  } catch (error) {
    console.error("[ProfilePage] Error fetching session:", error);
    return (
      <div>
        <p>Failed to load profile. Please try again later.</p>
      </div>
    );
  }
}
