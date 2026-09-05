'use client';

import { useRouter } from 'next/navigation';
import { ScanLine } from 'lucide-react';
import { useEffect } from 'react';
import ARStartCard from './ARStartCard';
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
            <div className="ar-camera-backdrop" />
            <ARStartCard
               onStart={onStart}
               failure={failure}
               checking={checking}
               marker={artifact.slug === 'drum' ? 'drum' : 'mask'}
            />
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
      <main className="ar-shell ar-camera-shell">
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
                  {/*
                   * All the guidance lives here rather than on the start
                   * screen, which is a bare button: an instruction read before
                   * the camera opens is an instruction forgotten by the time it
                   * matters. Keep it to one line — it shares the screen with
                   * the room. The MindAR fallback carries its own counterpart
                   * in VitrineAR.tsx; the two should change together.
                   */}
                  {state.placementKind === 'unplaced' && (
                     <p
                        className="ar-status-pill fixed inset-x-0 bottom-0 mx-auto mb-5 w-fit"
                        style={{
                           marginBottom:
                              'max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
                        }}
                     >
                        <ScanLine aria-hidden="true" />
                        <span>Point at the marker in the vitrine and tap</span>
                     </p>
                  )}
               </div>
            )}
         />
      </main>
   );
}
