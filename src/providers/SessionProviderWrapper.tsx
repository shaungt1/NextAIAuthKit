'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderWrapperProps {
  children: ReactNode;
}

const SessionProviderWrapper = ({ children }: SessionProviderWrapperProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
