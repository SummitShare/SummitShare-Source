'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { ARArtifact } from './artifacts';

function ARLoadingState() {
   return (
      <main className="fixed inset-0 flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#0f0c09] text-amber-100">
         <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
         <span className="sr-only">Loading augmented reality viewer</span>
      </main>
   );
}

const WebXRDemo = dynamic(() => import('./WebXRDemo'), {
   ssr: false,
   loading: ARLoadingState,
});

const VitrineAR = dynamic(() => import('./VitrineAR'), {
   ssr: false,
   loading: ARLoadingState,
});

interface ARClientProps {
   artifact: ARArtifact;
   preferWebXR?: boolean;
}

type Viewer = 'resolving' | 'webxr' | 'mindar';

export default function ARClient({
   artifact,
   preferWebXR = false,
}: ARClientProps) {
   const [viewer, setViewer] = useState<Viewer>(
      preferWebXR ? 'resolving' : 'mindar'
   );

   useEffect(() => {
      if (!preferWebXR) {
         setViewer('mindar');
         return;
      }

      let active = true;
      const selectViewer = async () => {
         try {
            const supported =
               (await navigator.xr?.isSessionSupported('immersive-ar')) ?? false;
            if (active) setViewer(supported ? 'webxr' : 'mindar');
         } catch {
            if (active) setViewer('mindar');
         }
      };
      void selectViewer();

      return () => {
         active = false;
      };
   }, [preferWebXR]);

   if (viewer === 'resolving') return <ARLoadingState />;
   if (viewer === 'webxr') return <WebXRDemo artifact={artifact} />;
   return <VitrineAR artifact={artifact} />;
}
