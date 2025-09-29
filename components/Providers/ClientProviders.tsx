'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const UserProvider = dynamic(
  () => import("@/context/UserContext").then((mod) => ({ default: mod.UserProvider })),
  { ssr: false }
);

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
};

export default ClientProviders;