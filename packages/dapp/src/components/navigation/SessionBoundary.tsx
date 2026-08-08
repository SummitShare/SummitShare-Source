'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * next-auth v4's `SessionProvider` ships without a `'use client'` directive, so
 * it cannot be rendered straight from a server layout. This wrapper is that
 * boundary, and keeps the layouts themselves server components — which is what
 * lets `PrimaryNav` stay on the server and gate its islands per route.
 */
export default function SessionBoundary({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return <SessionProvider>{children}</SessionProvider>;
}
