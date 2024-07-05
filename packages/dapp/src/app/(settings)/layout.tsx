'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import SecondaryNavBar from '../components/secondaryNavBar';
import PrimaryNav from '../components/navigation/PrimaryNav';
import { Web3Provider } from '@/functonality/Web3Provider';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'SummitShare',
  description: 'A Pan-African Mission',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <SessionProvider>
          <Web3Provider>
            <PrimaryNav />
            <SecondaryNavBar />
            {children}
          </Web3Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
