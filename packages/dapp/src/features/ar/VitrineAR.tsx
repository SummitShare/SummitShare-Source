'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Group, Material, Object3D, Texture } from 'three';
import type {
   MindARAnchor,
   MindARThree,
} from 'mind-ar/dist/mindar-image-three.prod.js';
import ARStartCard from './ARStartCard';
import { AR_EXIT_PATH, type ARArtifact } from './artifacts';
import { applyArtifactModelOpacity } from './loadArtifactModel';
import {
   createMindARPoseRelay,
   type MindARPoseParameters,
   type MindARPoseRelay,
} from './mindarPose';

type ARPhase =
   | 'idle'
   | 'starting'
   | 'loading-model'
   | 'scanning'
   | 'tracking'
   | 'error';

type ARErrorKind =
   | 'insecure'
   | 'permission'
   | 'no-camera'
   | 'unsupported'
   | 'camera-busy'
   | 'resources';

interface ARErrorState {
   kind: ARErrorKind;
   title: string;
   detail: string;
}

interface ActiveSession {
   mindAR: MindARThree;
   anchor: MindARAnchor;
   poseGroup: Group;
   targetUnitGroup: Group;
   uprightArtifact: Group | null;
   poseRelay: MindARPoseRelay;
   disposeModel: (() => void) | null;
   disposeDraco: (() => void) | null;
   injectedStyles: HTMLStyleElement[];
   /** Guards the renderer teardown, which is not itself idempotent. */
   cleaned: boolean;
}

interface RotationClamp {
   min: number;
   max: number;
}

interface DragState {
   pointerId: number;
   lastClientX: number;
   viewportWidth: number;
}

const ERROR_COPY: Record<ARErrorKind, Omit<ARErrorState, 'kind'>> = {
   insecure: {
      title: 'A secure connection is required',
      detail:
         'Camera access works only over HTTPS (or localhost during development). Reopen this page from the secure museum URL.',
   },
   permission: {
      title: 'Camera permission was denied',
      detail:
         'Allow camera access for this site in your browser settings, then return and try again.',
   },
   'no-camera': {
      title: 'No usable camera was found',
      detail:
         'This experience needs a rear-facing camera. Try a phone or tablet with an available camera.',
   },
   unsupported: {
      title: 'This browser is not supported',
      detail:
         'Use a current version of Safari on iPhone or Chrome on Android with WebGL and WebP enabled.',
   },
   'camera-busy': {
      title: 'The camera is unavailable',
      detail:
         'Another app may be using the camera. Close it, return to this page, and try again.',
   },
   resources: {
      title: 'The AR exhibit could not load',
      detail:
         'Check your connection and try again. If this continues, ask museum staff for help.',
   },
};

const INTERACTIVE_ELEMENT_SELECTOR =
   'a, button, input, select, textarea, audio[controls], video[controls], details, [role="button"], [role="link"], [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

/**
 * Maps one horizontal pointer sample to an absolute, hard-clamped yaw.
 * `radiansPerViewportFraction` is the sensitivity: one unit of horizontal
 * travel is one full viewport width.
 */
const mapHorizontalDragToRotation = (
   currentRotation: number,
   horizontalDelta: number,
   viewportWidth: number,
   radiansPerViewportFraction: number,
   clamp: RotationClamp
) =>
   Math.min(
      clamp.max,
      Math.max(
         clamp.min,
         currentRotation +
            (horizontalDelta / viewportWidth) * radiansPerViewportFraction
      )
   );

const isInteractiveTarget = (target: EventTarget | null) =>
   target instanceof Element &&
   target.closest(INTERACTIVE_ELEMENT_SELECTOR) !== null;

// Jump limits: past these, an accepted pose is snapped to rather than
// interpolated toward, because inside `missTolerance` MindAR can swap in a
// displaced pose with no lost/found event and smoothing would drag the artifact
// across the room.
//
// Both are unvalidated on device, and both MUST stay in step with the
// workbench harness's SHARED_DEFAULTS. They diverged once already — 25 here
// against 45 there — which would have made a calibration session in the harness
// unusable as evidence for what production does.
//
// The tuning tension, for whoever measures them: these are absolute, not
// per-second. At an 8-12 Hz pose rate on a weak Android, 100 ms separates
// samples, so 45 degrees is 450 deg/s while 25 would be 250 deg/s — reachable
// by an ordinary wrist flick, which would snap when it should smooth. Too high
// instead means a real re-acquisition gets smoothed through as a slide. The
// harness counts jump snaps; read that counter before changing either number.
const POSE_TRANSLATION_JUMP_LIMIT = 0.5;
const POSE_ROTATION_JUMP_LIMIT_DEGREES = 45;

const POSE_RELAY_PARAMETERS: MindARPoseParameters = {
   poseFilterMinCutOff: 1.5,
   poseFilterBeta: 0,
   poseRotationFilterBeta: 0.05,
   poseTranslationJumpLimit: POSE_TRANSLATION_JUMP_LIMIT,
   poseRotationJumpLimitDegrees: POSE_ROTATION_JUMP_LIMIT_DEGREES,
   warmupUpdates: 3,
   warmupFadeMs: 200,
   warmupTimeoutMs: 600,
   staleFadeUpdates: 4,
   staleFadeMs: 150,
   holdTranslationTargetUnits: 0.0025,
   holdRotationDegrees: 0.45,
   holdEngageUpdates: 6,
   depthFilterMinCutOff: 0.5,
   depthRangeTargetUnits: null,
};

const createError = (kind: ARErrorKind): ARErrorState => ({
   kind,
   ...ERROR_COPY[kind],
});

const classifyCameraError = (error: unknown): ARErrorState => {
   const name =
      error instanceof DOMException
         ? error.name
         : typeof error === 'object' &&
           error !== null &&
           'name' in error &&
           typeof error.name === 'string'
         ? error.name
         : '';

   if (name === 'NotAllowedError' || name === 'SecurityError') {
      return createError('permission');
   }
   if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return createError('no-camera');
   }
   if (
      name === 'NotReadableError' ||
      name === 'TrackStartError' ||
      name === 'AbortError'
   ) {
      return createError('camera-busy');
   }
   if (
      name === 'OverconstrainedError' ||
      name === 'ConstraintNotSatisfiedError'
   ) {
      return createError('no-camera');
   }
   return createError('unsupported');
};

const browserSupportsWebGL = () => {
   const canvas = document.createElement('canvas');
   const context =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

   if (!context) return false;
   const loseContext = (
      context as WebGLRenderingContext | WebGL2RenderingContext
   ).getExtension('WEBGL_lose_context');
   loseContext?.loseContext();
   return true;
};

// 1x1 lossy WebP. Decoding this is exactly the capability the artifact GLBs need,
// since they declare EXT_texture_webp.
const WEBP_PROBE =
   'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';

/**
 * Tests WebP *decoding*.
 *
 * The previous implementation tested `canvas.toDataURL('image/webp')`, which
 * measures ENCODING. Safari decodes WebP but has long declined to encode it,
 * silently returning `data:image/png` instead — so that check reported false on
 * every iPhone and rejected the viewer as "browser not supported" before the
 * camera was ever requested. Encoding is a capability this app never uses.
 */
const browserSupportsWebP = async () => {
   if (typeof createImageBitmap !== 'function') return false;
   try {
      const blob = await (await fetch(WEBP_PROBE)).blob();
      const bitmap = await createImageBitmap(blob);
      bitmap.close?.();
      return true;
   } catch {
      return false;
   }
};

const disposeObject = (
   root: Object3D,
   TextureClass: typeof Texture
): (() => void) => {
   return () => {
      const disposedTextures = new Set<Texture>();
      const disposedMaterials = new Set<Material>();

      root.traverse((object) => {
         const mesh = object as Object3D & {
            geometry?: { dispose: () => void };
            material?: Material | Material[];
         };
         mesh.geometry?.dispose();

         const materials = Array.isArray(mesh.material)
            ? mesh.material
            : mesh.material
            ? [mesh.material]
            : [];

         for (const material of materials) {
            if (disposedMaterials.has(material)) continue;
            disposedMaterials.add(material);
            for (const value of Object.values(material)) {
               if (
                  value instanceof TextureClass &&
                  !disposedTextures.has(value)
               ) {
                  disposedTextures.add(value);
                  value.dispose();
               }
            }
            material.dispose();
         }
      });
   };
};

interface VitrineARProps {
   artifact: ARArtifact;
}

export default function VitrineAR({ artifact }: VitrineARProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const sessionRef = useRef<ActiveSession | null>(null);
   const dragRef = useRef<DragState | null>(null);
   const rotationHintDismissedRef = useRef(false);
   const attemptRef = useRef(0);
   const mountedRef = useRef(true);
   const router = useRouter();
   const [phase, setPhase] = useState<ARPhase>('idle');
   const [error, setError] = useState<ARErrorState | null>(null);
   const [modelProgress, setModelProgress] = useState<number | null>(null);
   const [rotationHintDismissed, setRotationHintDismissed] = useState(false);

   // Starting value: one full-width sweep covers this artifact's entire clamp
   // range. It is expressed in radians per fraction of viewport width and needs
   // feel-testing on a phone before treating the sensitivity as calibrated.
   const dragSensitivityRadiansPerViewportFraction =
      artifact.rotationClamp.max - artifact.rotationClamp.min;

   /**
    * Tears down one specific session. Safe to call twice on the same session,
    * and safe to call on a session that is no longer the current one — a start
    * attempt that loses a race must not tear down the attempt that replaced it.
    */
   const cleanupKnownSession = useCallback((session: ActiveSession | null) => {
      if (!session || session.cleaned) return;
      session.cleaned = true;
      if (sessionRef.current === session) sessionRef.current = null;
      dragRef.current = null;

      session.mindAR.renderer.setAnimationLoop(null);
      session.anchor.onTargetFound = null;
      session.anchor.onTargetLost = null;
      session.anchor.onTargetUpdate = null;
      session.poseRelay.reset();
      try {
         session.mindAR.stop();
      } catch {
         // The camera may have failed before MindAR finished creating a controller.
      }

      session.disposeModel?.();
      session.disposeDraco?.();
      session.targetUnitGroup.removeFromParent();
      session.poseGroup.removeFromParent();
      session.mindAR.renderer.dispose();
      session.mindAR.renderer.forceContextLoss();
      session.mindAR.renderer.domElement.remove();
      session.mindAR.cssRenderer.domElement.remove();
      session.injectedStyles.forEach((style) => style.remove());

      const videos = containerRef.current?.querySelectorAll('video') ?? [];
      videos.forEach((video) => {
         const stream = video.srcObject;
         if (stream instanceof MediaStream) {
            stream.getTracks().forEach((track) => track.stop());
         }
         video.remove();
      });
   }, []);

   /** Tears down whichever session is currently mounted, if any. */
   const cleanupSession = useCallback(
      () => cleanupKnownSession(sessionRef.current),
      [cleanupKnownSession]
   );

   useEffect(() => {
      mountedRef.current = true;
      return () => {
         mountedRef.current = false;
         attemptRef.current += 1;
         cleanupSession();
      };
   }, [cleanupSession]);

   const endAR = useCallback(() => {
      attemptRef.current += 1;
      cleanupSession();
      setError(null);
      setModelProgress(null);
      setPhase('idle');
      // Tear down first, then leave. The camera and GL context are released
      // synchronously above, so the visitor never carries a live MediaStream
      // across the navigation.
      router.push(AR_EXIT_PATH);
   }, [cleanupSession, router]);

   const startAR = useCallback(async () => {
      const container = containerRef.current;
      if (!container) return;

      const attempt = attemptRef.current + 1;
      attemptRef.current = attempt;
      cleanupSession();
      setError(null);
      setModelProgress(null);
      rotationHintDismissedRef.current = false;
      setRotationHintDismissed(false);

      if (!window.isSecureContext) {
         setError(createError('insecure'));
         setPhase('error');
         return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
         setError(createError('unsupported'));
         setPhase('error');
         return;
      }
      if (!browserSupportsWebGL() || !(await browserSupportsWebP())) {
         setError(createError('unsupported'));
         setPhase('error');
         return;
      }
      if (attemptRef.current !== attempt) return;

      setPhase('starting');

      let permissionStream: MediaStream | null = null;
      try {
         permissionStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: { ideal: 'environment' } },
         });
      } catch (cameraError) {
         if (!mountedRef.current || attemptRef.current !== attempt) return;
         setError(classifyCameraError(cameraError));
         setPhase('error');
         return;
      } finally {
         permissionStream?.getTracks().forEach((track) => track.stop());
      }

      if (!mountedRef.current || attemptRef.current !== attempt) return;

      let loadingStage: 'tracker' | 'model' = 'tracker';
      let createdSession: ActiveSession | null = null;
      try {
         const [
            { MindARThree: MindARThreeClass },
            THREE,
            { GLTFLoader },
            { DRACOLoader },
         ] = await Promise.all([
            import('mind-ar/dist/mindar-image-three.prod.js'),
            import('three'),
            import('three/examples/jsm/loaders/GLTFLoader.js'),
            import('three/examples/jsm/loaders/DRACOLoader.js'),
         ]);

         if (!mountedRef.current || attemptRef.current !== attempt) return;

         const stylesBefore = new Set(document.head.querySelectorAll('style'));
         const mindAR = new MindARThreeClass({
            container,
            imageTargetSrc: artifact.targetUrl,
            maxTrack: 1,
            uiLoading: 'no',
            uiScanning: 'no',
            uiError: 'no',
            filterMinCF: 1,
            filterBeta: 0,
            warmupTolerance: 8,
            missTolerance: 12,
         });
         const injectedStyles = Array.from(
            document.head.querySelectorAll('style')
         ).filter(
            (style): style is HTMLStyleElement =>
               style instanceof HTMLStyleElement && !stylesBefore.has(style)
         );

         const anchor = mindAR.addAnchor(0);
         const poseGroup = new THREE.Group();
         poseGroup.matrixAutoUpdate = false;
         poseGroup.visible = false;
         mindAR.scene.add(poseGroup);

         const targetUnitGroup = new THREE.Group();
         poseGroup.add(targetUnitGroup);

         const poseRelay = createMindARPoseRelay();

         const session: ActiveSession = {
            mindAR,
            anchor,
            poseGroup,
            targetUnitGroup,
            uprightArtifact: null,
            poseRelay,
            disposeModel: null,
            disposeDraco: null,
            injectedStyles,
            cleaned: false,
         };
         createdSession = session;
         sessionRef.current = session;

         let poseUpdatePending = false;
         let poseUpdatePendingAt = 0;
         let relayPoseVisible = false;
         let modelReady = false;
         let recommendedOpacity = 0;

         const applyRelayVisibility = (poseVisible: boolean) => {
            poseGroup.visible = poseVisible;
            if (relayPoseVisible === poseVisible) return;
            relayPoseVisible = poseVisible;
            if (
               modelReady &&
               mountedRef.current &&
               attemptRef.current === attempt
            ) {
               setPhase(poseVisible ? 'tracking' : 'scanning');
            }
         };

         mindAR.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
         mindAR.renderer.setClearColor(0x000000, 0);
         mindAR.renderer.domElement.style.zIndex = '1';
         mindAR.cssRenderer.domElement.style.zIndex = '2';
         mindAR.cssRenderer.domElement.style.pointerEvents = 'none';

         anchor.onTargetFound = () => {
            poseUpdatePending = false;
            poseRelay.reset();
            recommendedOpacity = 0;
            if (session.uprightArtifact) {
               applyArtifactModelOpacity(session.uprightArtifact, 0);
            }
            if (
               modelReady &&
               !relayPoseVisible &&
               mountedRef.current &&
               attemptRef.current === attempt
            ) {
               setPhase('scanning');
            }
         };
         anchor.onTargetLost = () => {
            poseUpdatePending = false;
            poseRelay.reset();
            recommendedOpacity = 0;
            if (session.uprightArtifact) {
               applyArtifactModelOpacity(session.uprightArtifact, 0);
            }
            applyRelayVisibility(false);
         };
         anchor.onTargetUpdate = () => {
            if (!mountedRef.current || attemptRef.current !== attempt) return;
            poseUpdatePending = true;
            poseUpdatePendingAt = performance.now();
         };

         mindAR.scene.add(new THREE.HemisphereLight(0xfff2da, 0x2a1609, 2.2));
         const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
         keyLight.position.set(1.5, 2.5, 2);
         mindAR.scene.add(keyLight);
         const fillLight = new THREE.DirectionalLight(0xffc16b, 1.4);
         fillLight.position.set(-2, 1, 1);
         mindAR.scene.add(fillLight);

         await mindAR.start();
         if (!mountedRef.current || attemptRef.current !== attempt) {
            cleanupKnownSession(session);
            return;
         }

         if (mindAR.video) {
            mindAR.video.style.zIndex = '0';
         }
         mindAR.renderer.setAnimationLoop(() => {
            if (session.cleaned) return;

            const pendingPoseSampledAt = poseUpdatePendingAt;
            const hasPendingPose = poseUpdatePending;
            poseUpdatePending = false;
            if (hasPendingPose) {
               if (anchor.visible) {
                  // MindAR assigns anchor.group.matrix itself every frame, as
                  // worldMatrix * postMatrix — and that postMatrix is where the
                  // target's pixel width lives as uniform scale, which is the
                  // unit every displayHeight is expressed in. anchor.group is a
                  // direct child of the scene, so matrixWorld adds nothing; but
                  // updateWorldMatrix() calls updateMatrix() whenever
                  // matrixAutoUpdate is left on, recomposing the matrix from the
                  // group's own untouched position/quaternion/scale and throwing
                  // MindAR's assignment away. The scale collapses to 1, the
                  // artifact renders ~1000x too small, and nothing reports an
                  // error. Read the matrix MindAR actually wrote.
               }
               const poseUpdate = poseRelay.update({
                  anchorVisible: anchor.visible,
                  matrix: anchor.group.matrix,
                  sampledAt: pendingPoseSampledAt,
                  parameters: POSE_RELAY_PARAMETERS,
               });
               recommendedOpacity = poseUpdate.recommendedOpacity;
               if (session.uprightArtifact) {
                  applyArtifactModelOpacity(
                     session.uprightArtifact,
                     recommendedOpacity
                  );
               }
               if (
                  poseUpdate.accepted &&
                  poseUpdate.filteredPose !== null &&
                  poseUpdate.targetUnitScale !== null
               ) {
                  poseGroup.matrix.copy(poseUpdate.filteredPose.matrix);
                  targetUnitGroup.scale.setScalar(poseUpdate.targetUnitScale);
               }
            }

            const poseFrame = poseRelay.advanceFrame(anchor.visible);
            applyRelayVisibility(poseFrame.poseVisible);
            mindAR.renderer.render(mindAR.scene, mindAR.camera);
         });

         loadingStage = 'model';
         setPhase('loading-model');
         const dracoLoader = new DRACOLoader();
         dracoLoader.setDecoderPath('/ar/draco/');
         dracoLoader.setDecoderConfig({ type: 'wasm' });
         const gltfLoader = new GLTFLoader();
         gltfLoader.setDRACOLoader(dracoLoader);
         session.disposeDraco = () => dracoLoader.dispose();

         const gltf = await gltfLoader.loadAsync(artifact.modelUrl, (event) => {
            if (!mountedRef.current || attemptRef.current !== attempt) return;
            setModelProgress(
               event.total > 0
                  ? Math.min(100, Math.round((event.loaded / event.total) * 100))
                  : null
            );
         });

         const model = gltf.scene;
         // Hand the disposer to the session before any normalisation runs. The
         // bounds check below throws on a malformed model, and until the session
         // owns this the catch has nothing to release — the geometry and every
         // texture the GLTF just downloaded would leak.
         session.disposeModel = disposeObject(model, THREE.Texture);

         model.updateMatrixWorld(true);
         const bounds = new THREE.Box3().setFromObject(model);
         const size = bounds.getSize(new THREE.Vector3());
         if (
            !Number.isFinite(size.y) ||
            size.y <= 0 ||
            !Number.isFinite(size.x) ||
            !Number.isFinite(size.z)
         ) {
            throw new Error('The artifact model has invalid bounds.');
         }

         const scale = artifact.displayHeight / size.y;
         model.scale.multiplyScalar(scale);
         model.updateMatrixWorld(true);
         const scaledBounds = new THREE.Box3().setFromObject(model);
         const center = scaledBounds.getCenter(new THREE.Vector3());
         model.position.set(
            model.position.x - center.x,
            model.position.y - scaledBounds.min.y,
            model.position.z - center.z
         );

         const uprightArtifact = new THREE.Group();
         uprightArtifact.rotation.y = artifact.rotationY;
         uprightArtifact.add(model);
         session.uprightArtifact = uprightArtifact;
         applyArtifactModelOpacity(uprightArtifact, recommendedOpacity);

         const verticalMedallionMount = new THREE.Group();
         // The 768 px medallion occupies 75% of its square target canvas.
         // `mountY` is the per-artifact offset measured in those target units,
         // so this mount must remain inside `targetUnitGroup`.
         verticalMedallionMount.position.set(0, artifact.mountY, 0);
         verticalMedallionMount.add(uprightArtifact);
         targetUnitGroup.add(verticalMedallionMount);

         if (!mountedRef.current || attemptRef.current !== attempt) {
            cleanupKnownSession(session);
            return;
         }
         setModelProgress(100);
         modelReady = true;
         setPhase(relayPoseVisible ? 'tracking' : 'scanning');
      } catch (loadError) {
         cleanupKnownSession(createdSession);
         if (!mountedRef.current || attemptRef.current !== attempt) return;
         setError(
            loadingStage === 'model'
               ? {
                    kind: 'resources',
                    title: 'The artifact model could not load',
                    detail:
                       'The camera is working, but the 3D artifact or decoder failed to download. Check your connection and try again.',
                 }
               : createError('resources')
         );
         setPhase('error');
      }
   }, [artifact, cleanupSession, cleanupKnownSession]);

   const handlePointerDown = useCallback(
      (event: ReactPointerEvent<HTMLElement>) => {
         const session = sessionRef.current;
         if (
            !event.isPrimary ||
            event.button !== 0 ||
            isInteractiveTarget(event.target) ||
            !session?.uprightArtifact ||
            !session.poseGroup.visible
         ) {
            return;
         }

         dragRef.current = {
            pointerId: event.pointerId,
            lastClientX: event.clientX,
            viewportWidth: Math.max(event.currentTarget.clientWidth, 1),
         };
         event.currentTarget.setPointerCapture(event.pointerId);
         event.preventDefault();
      },
      []
   );

   const handlePointerMove = useCallback(
      (event: ReactPointerEvent<HTMLElement>) => {
         const drag = dragRef.current;
         const uprightArtifact = sessionRef.current?.uprightArtifact;
         if (!drag || drag.pointerId !== event.pointerId || !uprightArtifact) {
            return;
         }

         const horizontalDelta = event.clientX - drag.lastClientX;
         if (horizontalDelta === 0) return;

         uprightArtifact.rotation.y = mapHorizontalDragToRotation(
            uprightArtifact.rotation.y,
            horizontalDelta,
            drag.viewportWidth,
            dragSensitivityRadiansPerViewportFraction,
            artifact.rotationClamp
         );

         // Rebase on every sample, including samples clamped at an endpoint.
         // This throws away overshoot so a reversal moves immediately: the hard
         // stop feels like a physical limit, not a control that has gone dead.
         drag.lastClientX = event.clientX;

         if (!rotationHintDismissedRef.current) {
            rotationHintDismissedRef.current = true;
            setRotationHintDismissed(true);
         }
         event.preventDefault();
      },
      [artifact.rotationClamp, dragSensitivityRadiansPerViewportFraction]
   );

   const handlePointerEnd = useCallback(
      (event: ReactPointerEvent<HTMLElement>) => {
         if (dragRef.current?.pointerId !== event.pointerId) return;
         dragRef.current = null;
         if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
         }
      },
      []
   );

   const handleLostPointerCapture = useCallback(
      (event: ReactPointerEvent<HTMLElement>) => {
         if (dragRef.current?.pointerId === event.pointerId) {
            dragRef.current = null;
         }
      },
      []
   );

   const isRunning =
      phase === 'starting' ||
      phase === 'loading-model' ||
      phase === 'scanning' ||
      phase === 'tracking';

   return (
      <main
         className="ar-shell ar-camera-shell touch-none"
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerEnd}
         onPointerCancel={handlePointerEnd}
         onLostPointerCapture={handleLostPointerCapture}
      >
         <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            aria-hidden={phase === 'idle' || phase === 'error'}
         />

         {(phase === 'idle' || phase === 'error') && (
            <div className="ar-camera-backdrop" />
         )}

         <header
            className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-end px-4 sm:px-6"
            style={{
               paddingTop: 'max(1rem, env(safe-area-inset-top))',
            }}
         >
            {isRunning && (
               <button
                  type="button"
                  onClick={endAR}
                  className="ar-overlay-button"
               >
                  <X aria-hidden="true" />
                  <span>End AR</span>
               </button>
            )}
         </header>

         <div
            className="absolute inset-0 z-10 flex items-center justify-center px-5"
            aria-live="polite"
         >
            {phase === 'idle' && (
               <ARStartCard
                  artifactName={artifact.name}
                  onStart={startAR}
               />
            )}

            {(phase === 'starting' || phase === 'loading-model') && (
               <section className="ar-loading-panel">
                  <div className="ar-spinner" />
                  <p className="ar-loading-text">
                     {phase === 'starting'
                        ? 'Starting camera and tracker…'
                        : `Loading ${artifact.name}…`}
                  </p>
                  {phase === 'loading-model' && modelProgress !== null && (
                     <div className="ar-progress">
                        <div
                           className="ar-progress-bar"
                           style={{ width: `${modelProgress}%` }}
                        />
                     </div>
                  )}
               </section>
            )}

            {phase === 'error' && error && (
               <section className="ar-error-card pointer-events-auto">
                  <div className="ar-error-mark">
                     <AlertTriangle aria-hidden="true" />
                  </div>
                  <h1 className="ar-error-title">{error.title}</h1>
                  <p className="ar-error-detail">{error.detail}</p>
                  <button
                     type="button"
                     onClick={startAR}
                     className="ar-button-secondary mt-6 w-full"
                  >
                     <RotateCcw aria-hidden="true" />
                     <span>Try again</span>
                  </button>
               </section>
            )}
         </div>

         {phase === 'tracking' && (
            <div
               className={`ar-rotation-hint pointer-events-none absolute left-1/2 top-[56%] z-20 -translate-x-1/2 transition-opacity duration-500 motion-reduce:transition-none ${
                  rotationHintDismissed ? 'opacity-0' : 'opacity-100'
               }`}
               aria-hidden="true"
            >
               <svg
                  viewBox="0 0 160 88"
                  className="h-[5.5rem] w-40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M22.5 68.5C28.8 18.7 124.6 17.2 136 65.1"
                     stroke="currentColor"
                     strokeWidth="1.35"
                     strokeLinecap="round"
                  />
                  <path
                     d="M24.1 69.4C31.5 20.3 122.8 19 134.8 65.8"
                     stroke="currentColor"
                     strokeWidth="0.75"
                     strokeLinecap="round"
                     opacity="0.42"
                  />
                  <path
                     d="M126.8 59.5L136.2 66.1L138.3 54.9"
                     stroke="currentColor"
                     strokeWidth="1.35"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            </div>
         )}

         {(phase === 'scanning' || phase === 'tracking') && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-5 text-center">
               <div
                  className="ar-status-pill mb-4"
                  style={{
                     marginBottom:
                        'max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))',
                  }}
               >
                  <span
                     className={`ar-status-dot ${
                        phase === 'tracking'
                           ? 'ar-status-dot--tracking'
                           : 'ar-status-dot--scanning'
                     }`}
                  />
                  {/*
                   * The counterpart to WebXRDemo's placement prompt, and
                   * deliberately different: this path tracks the marker, so the
                   * marker must stay in frame and there is nothing to tap. Kept
                   * to a few words — the visitor is looking at the vitrine, not
                   * at the phone, and the dot already carries the state.
                   */}
                  {phase === 'tracking' ? 'Locked' : 'Point at the marker'}
               </div>
            </div>
         )}
      </main>
   );
}
