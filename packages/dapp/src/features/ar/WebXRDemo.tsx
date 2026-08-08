'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DemoWordmark from './DemoWordmark';
import { AR_EXIT_PATH, type ARArtifact } from './artifacts';
import {
   XRVitrine,
   type UnsupportedReason,
   type XRVitrineArtifact,
} from './xrVitrine';

const resolveNextAssetUrl = (path: string) => path;

type UserFailure = Readonly<{
   title: string;
   detail: string;
}>;

const failureCopy = (
   reason: UnsupportedReason,
   artifactName: string
): UserFailure => {
   switch (reason.kind) {
      case 'insecure-context':
         return {
            title: 'A secure connection is required',
            detail:
               'Reopen this page from the secure museum address to use augmented reality.',
         };
      case 'missing-webxr':
         return {
            title: 'Immersive AR is not available',
            detail:
               'This browser does not provide the immersive camera experience needed for the demo.',
         };
      case 'immersive-ar-unsupported':
      case 'entry-not-supported':
         return {
            title: 'This AR experience is not available',
            detail: 'Try this demo on a compatible Android device and browser.',
         };
      case 'permission-denied':
         return {
            title: 'Camera access was not allowed',
            detail:
               'Allow camera access for this site, then return and try again.',
         };
      case 'dom-overlay-unavailable':
         return {
            title: 'The AR controls could not open',
            detail:
               'This browser did not provide the safe on-screen view required by the demo.',
         };
      case 'hit-test-unavailable':
         return {
            title: 'A surface could not be detected',
            detail: `This device could not prepare surface placement for ${artifactName}.`,
         };
      case 'session-ended':
         return {
            title: 'The AR session ended',
            detail: `You can start the ${artifactName} demo again whenever you are ready.`,
         };
      case 'capability-check-failed':
      case 'entry-failed':
         return {
            title: 'AR could not start',
            detail:
               'Close any other camera experience, check your connection, and try again.',
         };
      case 'checking':
         return {
            title: 'Checking augmented reality support…',
            detail: '',
         };
   }
};

function StartScreen({
   artifact,
   reason,
   onStart,
}: Readonly<{
   artifact: ARArtifact;
   reason?: UnsupportedReason;
   onStart?: () => void;
}>) {
   const failure = reason ? failureCopy(reason, artifact.name) : null;
   const checking = reason?.kind === 'checking';

   return (
      <>
         <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(245,158,11,0.2),transparent_38%),radial-gradient(circle_at_80%_85%,rgba(180,83,9,0.18),transparent_42%),linear-gradient(145deg,#17110b,#0f0c09_55%,#090706)]" />
            <section className="pointer-events-auto relative w-full max-w-md rounded-3xl border border-white/10 bg-[#14100c]/95 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
               {checking ? (
                  <>
                     <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
                     <p className="mt-4 text-sm font-medium !text-amber-50">
                        Checking augmented reality support…
                     </p>
                  </>
               ) : (
                  <>
                     <p className="text-xs uppercase tracking-[0.32em] !text-amber-200/65">
                        {artifact.associatedHistory}
                     </p>
                     <h1 className="mt-3 text-3xl !text-amber-50">
                        {artifact.name}
                     </h1>
                     {failure && (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                           <p className="text-sm font-semibold !text-amber-50">
                              {failure.title}
                           </p>
                           <p className="mt-1 text-xs leading-5 !text-amber-100/65">
                              {failure.detail}
                           </p>
                        </div>
                     )}
                     {onStart && (
                        <>
                           <button
                              type="button"
                              onClick={onStart}
                              className="mt-7 w-full rounded-full bg-amber-300 px-6 py-3.5 text-sm font-semibold text-[#24160a] shadow-[0_12px_40px_-12px_rgba(252,211,77,0.75)] transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:ring-offset-2 focus:ring-offset-[#14100c]"
                           >
                              Start AR
                           </button>
                           <p className="mt-3 text-xs !text-amber-100/50">
                              Your camera is used only for this live AR view.
                           </p>
                           <p className="mt-2 text-xs !text-amber-100/50">
                              Best supported on Android. iOS support is
                              experimental.
                           </p>
                        </>
                     )}
                  </>
               )}
            </section>
         </div>
         <DemoWordmark />
      </>
   );
}

/**
 * Reasons that mean this device can never run our WebXR path, so the marker
 * should be served by MindAR instead.
 *
 * `navigator.xr.isSessionSupported('immersive-ar')` cannot tell us whether the
 * required features — `local-floor`, `hit-test`, `dom-overlay` — are actually
 * available; that only surfaces once `requestSession` is attempted. Without a
 * fallback such a device reaches a retry button that can never succeed, and
 * before marker routing existed it would have had a working MindAR viewer.
 *
 * Deliberately excluded: `permission-denied` and `insecure-context` (MindAR
 * needs the camera and a secure context too, so falling back changes nothing),
 * `session-ended` (a normal exit), and `entry-failed` (often transient — the
 * retry is genuine there).
 */
const MINDAR_FALLBACK_REASONS = new Set<UnsupportedReason['kind']>([
   'missing-webxr',
   'immersive-ar-unsupported',
   'capability-check-failed',
   'entry-not-supported',
   'dom-overlay-unavailable',
   'hit-test-unavailable',
]);

/**
 * Renders nothing. `renderUnsupported` is called during XRVitrine's render, so
 * both escalations have to happen in an effect rather than inline.
 *
 * `session-ended` is the WebXR counterpart of MindAR's "End AR" button — the
 * visitor has left the immersive session, so they go to the same place.
 */
function UnsupportedEscalation({
   reason,
   onFallback,
}: Readonly<{
   reason: UnsupportedReason;
   onFallback?: () => void;
}>) {
   const router = useRouter();

   useEffect(() => {
      if (reason.kind === 'session-ended') {
         router.push(AR_EXIT_PATH);
         return;
      }
      if (onFallback && MINDAR_FALLBACK_REASONS.has(reason.kind)) onFallback();
   }, [reason.kind, onFallback, router]);

   return null;
}

export default function WebXRDemo({
   artifact,
   onUnavailable,
}: {
   artifact: ARArtifact;
   onUnavailable?: () => void;
}) {
   const xrArtifact: XRVitrineArtifact = {
      slug: artifact.slug,
      name: artifact.name,
      // WebXR calibration, not the marker-relative MindAR one — see artifacts.ts.
      heightMetres: artifact.webxr.heightMetres,
      rotationY: artifact.webxr.rotationY,
      modelUrl: artifact.modelUrl,
   };

   return (
      <main className="fixed inset-0 isolate h-[100dvh] min-h-[100svh] w-screen overflow-hidden bg-[#0f0c09] text-amber-50">
         <XRVitrine
            artifact={xrArtifact}
            options={{ nudge: artifact.webxr.nudge }}
            resolveAssetUrl={resolveNextAssetUrl}
            renderUnsupported={(reason) => (
               <>
                  <UnsupportedEscalation
                     reason={reason}
                     onFallback={onUnavailable}
                  />
                  <StartScreen
                     artifact={artifact}
                     reason={reason}
                     onStart={reason.retry}
                  />
               </>
            )}
            renderStart={(start) => (
               <StartScreen artifact={artifact} onStart={start} />
            )}
            renderOverlay={(state) => (
               <div className="pointer-events-none fixed inset-0 z-20">
                  <DemoWordmark />
                  {state.placementKind === 'unplaced' && (
                     <p
                        className="fixed inset-x-0 bottom-0 mx-auto mb-5 w-fit max-w-[calc(100vw-2rem)] rounded-full border border-white/15 bg-black/55 px-5 py-2.5 text-center text-xs font-medium !text-amber-50 backdrop-blur-md"
                        style={{
                           marginBottom:
                              'max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
                        }}
                     >
                        Point at a flat surface, then tap to place
                     </p>
                  )}
               </div>
            )}
         />
      </main>
   );
}
