'use client';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <SessionProvider>
            <body>{children}</body>
         </SessionProvider>
      </html>
   );
}
