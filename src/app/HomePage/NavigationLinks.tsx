'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVIGATION_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/examples', label: 'Examples' },
];


const NavigationLinks = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3">
      {NAVIGATION_LINKS.map((link) => {
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
      {session ? (
        <>
          <Link href="/profile">
            <button className="rounded px-3 py-2 bg-primary dark:bg-neutral-700">
              Profile
            </button>
          </Link>
          <button
            className="rounded px-3 py-2 bg-red-500 text-white"
            onClick={() => signOut({ callbackUrl: "/" })}>
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
