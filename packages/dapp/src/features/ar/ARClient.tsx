'use client';

import dynamic from 'next/dynamic';
import type { ARArtifact } from './artifacts';

const VitrineAR = dynamic(() => import('./VitrineAR'), {
   ssr: false,
   loading: () => (
      <main className="fixed inset-0 flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#0f0c09] text-amber-100">
         <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
         <span className="sr-only">Loading augmented reality viewer</span>
      </main>
   ),
});

interface ARClientProps {
   artifact: ARArtifact;
}

export default function ARClient({ artifact }: ARClientProps) {
   return <VitrineAR artifact={artifact} />;
}
