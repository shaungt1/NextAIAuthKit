'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { NAVIGATION_LINKS, NAVIGATION_LINKS_SECURE } from '@/app/routes';

const NAVIGATION_LINKS = [
  { href: '/', label: 'Home', protected: false },
  { href: '/examples', label: 'Examples', protected: false },
  { href: '/ai', label: 'AI Playground', protected: true },
  { href: '/admin', label: 'Admin Panel', protected: true, role: 'ADMIN' }, // Admin only
];

const NavigationLinks = () => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [user, setUser] = useState<any | null>(null);

    // Log session object to check if role exists
    // useEffect(() => {
    //     console.log("🛠️ Session Object:", session);
    //     if (session?.user) {
    //         setUser(session.user);
    //     }
    // }, [session]);

    // Store session data in session storage on login
    useEffect(() => {
      if (session?.user) {
          setUser(session.user);
          sessionStorage.setItem("userSession", JSON.stringify(session.user));
      } else {
          sessionStorage.removeItem("userSession");
      }
  }, [session]);

  const handleLogout = () => {
      signOut({ callbackUrl: "/" });
      sessionStorage.removeItem("userSession");
  };

    // const handleLogout = () => {
    //     signOut({ callbackUrl: "/" });
    // };

    return (
        <div className="flex items-center gap-3">
            {NAVIGATION_LINKS.map((link) => {
                const isProtected = link.protected && !user;
                const isAdmin = link.role && (!user || user.role !== 'ADMIN');

                if (isProtected || isAdmin) return null;

                const active = link.href === '/' ? pathname === link.href : pathname?.includes(link.href);

                return (
                    <Link key={link.href} href={link.href}>
                        <button
                            className={`${
                                active ? 'bg-primary dark:bg-neutral-700' : 'bg-transparent'
                            } rounded px-3 py-2`}>
                            {link.label}
                        </button>
                    </Link>
                );
            })}

            {status === "loading" ? (
                <p className="text-gray-400">Loading...</p>
            ) : session ? (
                <>
                    <Link href="/profile">
                        <button className="rounded px-3 py-2 bg-primary dark:bg-neutral-700">
                            Profile
                        </button>
                    </Link>
                    <button
                        className="rounded px-3 py-2 bg-red-500 text-white"
                        onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <Link href="/auth/login">
                    <button className="rounded px-3 py-2 bg-primary text-white">
                        Login
                    </button>
                </Link>
            )}
        </div>
    );
};

export default NavigationLinks;
