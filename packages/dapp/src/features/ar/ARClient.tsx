'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
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
}

type Viewer = 'resolving' | 'webxr' | 'mindar';

/**
 * Which viewer runs is a question about the device, and only about the device.
 *
 * WebXR is the real experience: ARCore holds the artifact on an `XRAnchor` and
 * the visitor walks around it. MindAR re-derives pose from pixels every frame
 * and only holds while the marker is in view — it exists because iOS Safari has
 * no `immersive-ar`, and every iOS browser is WebKit, so there is no way around
 * it on an iPhone. It is the fallback, not an alternative.
 *
 * So the probe runs unconditionally. This used to be gated on a per-artifact
 * `calibrated` flag, which meant an Android phone scanning an artifact nobody
 * had measured yet was handed the degraded path without anything saying so —
 * a Galaxy Tab S9 ran MindAR for exactly this reason. Artifact data must never
 * decide this again; if a height is wrong, fix the height.
 */
export default function ARClient({ artifact }: ARClientProps) {
   const [viewer, setViewer] = useState<Viewer>('resolving');

   // `isSessionSupported` only answers for the mode, not for the features the
   // session actually requires, so WebXR can still turn out to be unusable
   // after this resolves. The viewer escalates back here rather than stranding
   // the visitor on a retry that cannot succeed.
   const fallBackToMindAR = useCallback(() => setViewer('mindar'), []);

   useEffect(() => {
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
   }, []);

   if (viewer === 'resolving') return <ARLoadingState />;
   if (viewer === 'webxr') {
      return <WebXRDemo artifact={artifact} onUnavailable={fallBackToMindAR} />;
   }
   return <VitrineAR artifact={artifact} />;
}
