'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Material, Object3D, Texture } from 'three';
import type { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import type { ARArtifact } from './artifacts';

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
   disposeModel: (() => void) | null;
   disposeDraco: (() => void) | null;
   injectedStyles: HTMLStyleElement[];
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

// The 768 px medallion occupies 75% of its square MindAR target canvas.
const VERTICAL_MEDALLION_LOWER_EDGE_Y = -0.375;

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
   const attemptRef = useRef(0);
   const mountedRef = useRef(true);
   const [phase, setPhase] = useState<ARPhase>('idle');
   const [error, setError] = useState<ARErrorState | null>(null);
   const [modelProgress, setModelProgress] = useState<number | null>(null);

   const cleanupSession = useCallback((explicit?: ActiveSession | null) => {
      const session = explicit === undefined ? sessionRef.current : explicit;
      if (!session) return;
      if (sessionRef.current === session) sessionRef.current = null;

      session.mindAR.renderer.setAnimationLoop(null);
      try {
         session.mindAR.stop();
      } catch {
         // The camera may have failed before MindAR finished creating a controller.
      }

      const disposeModel = session.disposeModel;
      const disposeDraco = session.disposeDraco;
      session.disposeModel = null;
      session.disposeDraco = null;
      disposeModel?.();
      disposeDraco?.();
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
   }, [cleanupSession]);

   const startAR = useCallback(async () => {
      const container = containerRef.current;
      if (!container) return;

      const attempt = attemptRef.current + 1;
      attemptRef.current = attempt;
      cleanupSession();
      setError(null);
      setModelProgress(null);

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
            warmupTolerance: 5,
            missTolerance: 12,
         });
         const injectedStyles = Array.from(
            document.head.querySelectorAll('style')
         ).filter(
            (style): style is HTMLStyleElement =>
               style instanceof HTMLStyleElement && !stylesBefore.has(style)
         );

         const session: ActiveSession = {
            mindAR,
            disposeModel: null,
            disposeDraco: null,
            injectedStyles,
         };
         createdSession = session;
         sessionRef.current = session;

         mindAR.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
         mindAR.renderer.setClearColor(0x000000, 0);
         mindAR.renderer.domElement.style.zIndex = '1';
         mindAR.cssRenderer.domElement.style.zIndex = '2';
         mindAR.cssRenderer.domElement.style.pointerEvents = 'none';

         const anchor = mindAR.addAnchor(0);
         anchor.onTargetFound = () => {
            if (mountedRef.current && attemptRef.current === attempt) {
               setPhase('tracking');
            }
         };
         anchor.onTargetLost = () => {
            if (mountedRef.current && attemptRef.current === attempt) {
               setPhase('scanning');
            }
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
            cleanupSession(session);
            return;
         }

         if (mindAR.video) {
            mindAR.video.style.zIndex = '0';
         }
         mindAR.renderer.setAnimationLoop(() => {
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

         const verticalMedallionMount = new THREE.Group();
         verticalMedallionMount.position.set(
            0,
            VERTICAL_MEDALLION_LOWER_EDGE_Y,
            0
         );
         verticalMedallionMount.add(uprightArtifact);
         anchor.group.add(verticalMedallionMount);

         const disposeModel = disposeObject(model, THREE.Texture);
         if (!mountedRef.current || attemptRef.current !== attempt) {
            disposeModel();
            cleanupSession(session);
            return;
         }
         session.disposeModel = disposeModel;
         setModelProgress(100);
         setPhase(anchor.visible ? 'tracking' : 'scanning');
      } catch (loadError) {
         cleanupSession(createdSession);
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
   }, [artifact, cleanupSession]);

   const isRunning =
      phase === 'starting' ||
      phase === 'loading-model' ||
      phase === 'scanning' ||
      phase === 'tracking';

   return (
      <main className="fixed inset-0 isolate h-[100dvh] min-h-[100svh] w-screen overflow-hidden bg-[#0f0c09] text-amber-50">
         <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            aria-hidden={phase === 'idle' || phase === 'error'}
         />

         {(phase === 'idle' || phase === 'error') && (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(245,158,11,0.2),transparent_38%),radial-gradient(circle_at_80%_85%,rgba(180,83,9,0.18),transparent_42%),linear-gradient(145deg,#17110b,#0f0c09_55%,#090706)]" />
         )}

         <header
            className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 px-4 sm:px-6"
            style={{
               paddingTop: 'max(1rem, env(safe-area-inset-top))',
            }}
         >
            <div className="max-w-[70vw] rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
               <p className="text-[10px] uppercase tracking-[0.35em] !text-amber-200/70">
                  SummitShare · AR
               </p>
               <p className="mt-1 truncate text-sm font-semibold !text-amber-50 sm:text-base">
                  {artifact.name}
               </p>
            </div>
            {isRunning && (
               <button
                  type="button"
                  onClick={endAR}
                  className="pointer-events-auto rounded-full border border-white/20 bg-black/45 px-4 py-2 text-xs font-medium !text-amber-100 backdrop-blur-md transition hover:border-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-300"
               >
                  End AR
               </button>
            )}
         </header>

         <div
            className="absolute inset-0 z-10 flex items-center justify-center px-5"
            aria-live="polite"
         >
            {phase === 'idle' && (
               <section className="pointer-events-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#14100c]/95 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-amber-200/30 bg-amber-300/10">
                     <span className="text-2xl text-amber-200" aria-hidden="true">
                        ◈
                     </span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.32em] !text-amber-200/65">
                     {artifact.associatedHistory}
                  </p>
                  <h1 className="mt-3 text-3xl !text-amber-50">
                     {artifact.name}
                  </h1>
                  <p className="mt-4 text-sm leading-6 !text-amber-100/75">
                     The QR opened this exhibit. Next, allow camera access and
                     point your phone at the circular tracking medallion mounted
                     upright on the stand inside the bell jar.
                  </p>
                  <button
                     type="button"
                     onClick={startAR}
                     className="mt-7 w-full rounded-full bg-amber-300 px-6 py-3.5 text-sm font-semibold text-[#24160a] shadow-[0_12px_40px_-12px_rgba(252,211,77,0.75)] transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:ring-offset-2 focus:ring-offset-[#14100c]"
                  >
                     Start AR
                  </button>
                  <p className="mt-3 text-xs !text-amber-100/50">
                     Your camera is used only for this live view.
                  </p>
               </section>
            )}

            {(phase === 'starting' || phase === 'loading-model') && (
               <section className="rounded-3xl border border-white/10 bg-black/60 px-7 py-6 text-center shadow-2xl backdrop-blur-lg">
                  <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
                  <p className="mt-4 text-sm font-medium !text-amber-50">
                     {phase === 'starting'
                        ? 'Starting camera and tracker…'
                        : `Loading ${artifact.name}…`}
                  </p>
                  {phase === 'loading-model' && modelProgress !== null && (
                     <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-white/15">
                        <div
                           className="h-full rounded-full bg-amber-300 transition-[width]"
                           style={{ width: `${modelProgress}%` }}
                        />
                     </div>
                  )}
               </section>
            )}

            {phase === 'error' && error && (
               <section className="pointer-events-auto w-full max-w-md rounded-3xl border border-red-200/20 bg-[#17100d]/95 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-200/25 bg-red-300/10 text-xl text-red-100">
                     !
                  </div>
                  <h1 className="mt-5 text-2xl !text-amber-50">{error.title}</h1>
                  <p className="mt-3 text-sm leading-6 !text-amber-100/70">
                     {error.detail}
                  </p>
                  <button
                     type="button"
                     onClick={startAR}
                     className="mt-6 w-full rounded-full border border-amber-200/40 bg-amber-300/10 px-6 py-3 text-sm font-semibold !text-amber-100 transition hover:bg-amber-300/20 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                     Try again
                  </button>
               </section>
            )}
         </div>

         {(phase === 'scanning' || phase === 'tracking') && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-5 text-center">
               {phase === 'scanning' && (
                  <div className="relative mb-5 h-36 w-36 rounded-2xl border border-amber-200/25">
                     <span className="absolute -left-px -top-px h-8 w-8 rounded-tl-2xl border-l-2 border-t-2 border-amber-200" />
                     <span className="absolute -right-px -top-px h-8 w-8 rounded-tr-2xl border-r-2 border-t-2 border-amber-200" />
                     <span className="absolute -bottom-px -left-px h-8 w-8 rounded-bl-2xl border-b-2 border-l-2 border-amber-200" />
                     <span className="absolute -bottom-px -right-px h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-amber-200" />
                  </div>
               )}
               <div
                  className="mb-4 rounded-full border border-white/15 bg-black/55 px-5 py-2.5 text-xs font-medium !text-amber-50 backdrop-blur-md"
                  style={{
                     marginBottom:
                        'max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))',
                  }}
               >
                  <span
                     className={`mr-2 inline-block h-2 w-2 rounded-full ${
                        phase === 'tracking'
                           ? 'bg-emerald-300'
                           : 'animate-pulse bg-amber-300'
                     }`}
                  />
                  {phase === 'tracking'
                     ? 'Artifact locked to the vitrine'
                     : 'Aim at the medallion on the stand'}
               </div>
            </div>
         )}
      </main>
   );
}
