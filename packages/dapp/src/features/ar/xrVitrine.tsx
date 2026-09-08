import { Canvas, useFrame } from '@react-three/fiber';
import {
   createXRStore,
   XR,
   XRDomOverlay,
   XRSpace,
   type XRStore,
} from '@react-three/xr';
import {
   useCallback,
   useEffect,
   useLayoutEffect,
   useMemo,
   useRef,
   useState,
   type MutableRefObject,
   type ReactNode,
} from 'react';
import { Group, Matrix4, Vector3, type Object3D } from 'three';
import { loadArtifactModel } from './loadArtifactModel';
import {
   commitPlacement,
   type LocalFloorPose,
   type Placement,
} from './placement';

const MAX_TILT_RADIANS = (20 * Math.PI) / 180;
const MIN_SURFACE_UP_DOT = Math.cos(MAX_TILT_RADIANS);
const REQUIRED_FEATURES = ['local-floor', 'hit-test', 'dom-overlay'] as const;
const BASE_OPTIONAL_FEATURES = ['anchors'] as const;
const DRACO_DECODER_ASSET_PATH = '/ar/draco/';

/**
 * `heightMetres` is a real-world height, not MindAR's marker-relative unit.
 * WebXR places into a metric room frame, so the caller owns any conversion.
 */
export type XRVitrineArtifact = Readonly<{
   slug: string;
   name: string;
   heightMetres: number;
   rotationY: number;
   modelUrl: string;
}>;

export type VitrineNudge = Readonly<{
   x: number;
   y: number;
   z: number;
   yaw: number;
}>;

export type PlacementPolicy = 'anchor' | 'force-fixed';

export type UnsupportedReason = Readonly<{
   kind:
      | 'checking'
      | 'insecure-context'
      | 'missing-webxr'
      | 'immersive-ar-unsupported'
      | 'capability-check-failed'
      | 'entry-not-supported'
      | 'permission-denied'
      | 'entry-failed'
      | 'dom-overlay-unavailable'
      | 'hit-test-unavailable'
      | 'session-ended';
   message: string;
   retry?: () => void;
}>;

export type SessionFeatureInfo = Readonly<{
   required: readonly string[];
   optional: readonly string[];
   granted: readonly string[] | null;
   domOverlayType: string | null;
}>;

export type VitrineFps = Readonly<{
   current: number;
   median: number;
   p5: number;
}>;

export type VitrineState = Readonly<{
   placementKind: 'unplaced' | 'anchored' | 'fixed';
   placementReason: string | null;
   placementMessage: string;
   placementPolicy: PlacementPolicy;
   setPlacementPolicy: (policy: PlacementPolicy) => void;
   anchorLocatable: boolean | null;
   anchorUnlocatableFrames: number;
   reticleVisible: boolean;
   modelProgress: number | null;
   modelError: string | null;
   fps: VitrineFps;
   sessionFeatures: SessionFeatureInfo;
   endSession: () => void;
}>;

export type CameraAccessProbeContext = Readonly<{
   session: XRSession;
   localFloorSpace: XRReferenceSpace;
   sessionFeatures: SessionFeatureInfo;
}>;

export type XRVitrineOptions = Readonly<{
   nudge?: VitrineNudge;
   enableFpsSampling?: boolean;
   cameraAccessProbe?: (context: CameraAccessProbeContext) => ReactNode;
}>;

export type XRVitrineProps = Readonly<{
   artifact: XRVitrineArtifact;
   options: XRVitrineOptions;
   resolveAssetUrl: (path: string) => string;
   renderUnsupported: (reason: UnsupportedReason) => ReactNode;
   renderStart: (start: () => void) => ReactNode;
   renderOverlay: (state: VitrineState) => ReactNode;
}>;

type CapabilityState =
   | Readonly<{ kind: 'checking' }>
   | Readonly<{ kind: 'ready' }>
   | Readonly<{ kind: 'blocked'; reason: UnsupportedReason }>;

type SessionResources = Readonly<{
   session: XRSession;
   hitTestSource: XRHitTestSource;
   localFloorSpace: XRReferenceSpace;
}>;

type AnchorSpaceGroup = Group & { transformReady?: boolean };

type LifecycleRefs = Readonly<{
   acceptingRef: MutableRefObject<boolean>;
   disposeModelRef: MutableRefObject<(() => void) | null>;
}>;

const ZERO_NUDGE: VitrineNudge = { x: 0, y: 0, z: 0, yaw: 0 };
const ZERO_FPS: VitrineFps = { current: 0, median: 0, p5: 0 };
const SESSION_ENDED_REASON: UnsupportedReason = {
   kind: 'session-ended',
   message: 'The XR session ended. You can start another run.',
};

const formatError = (error: unknown) =>
   error instanceof Error ? `${error.name}: ${error.message}` : String(error);

const percentile = (sorted: readonly number[], fraction: number) => {
   if (sorted.length === 0) return 0;
   return sorted[Math.floor((sorted.length - 1) * fraction)] ?? 0;
};

const entryFailure = (error: unknown): UnsupportedReason => {
   const name = error instanceof Error ? error.name : '';
   if (name === 'NotSupportedError') {
      return {
         kind: 'entry-not-supported',
         message: `The requested immersive AR feature set is unsupported (${formatError(
            error
         )}).`,
      };
   }
   if (name === 'NotAllowedError' || name === 'SecurityError') {
      return {
         kind: 'permission-denied',
         message: `XR or camera permission was denied (${formatError(error)}).`,
      };
   }
   return {
      kind: 'entry-failed',
      message: `XR entry failed (${formatError(error)}).`,
   };
};

function FpsProbe({ onFps }: Readonly<{ onFps: (fps: VitrineFps) => void }>) {
   const previousAt = useRef<number | null>(null);
   const reportedAt = useRef(0);
   const samples = useRef<number[]>([]);

   useFrame(() => {
      const now = performance.now();
      if (previousAt.current !== null) {
         const delta = now - previousAt.current;
         if (delta > 0) {
            samples.current.push(1000 / delta);
            if (samples.current.length > 1800) samples.current.shift();
         }
      }
      previousAt.current = now;
      if (now - reportedAt.current < 500 || samples.current.length === 0) return;
      reportedAt.current = now;
      const sorted = [...samples.current].sort((left, right) => left - right);
      const current = samples.current[samples.current.length - 1] ?? 0;
      onFps({
         current: Math.round(current),
         median: Math.round(percentile(sorted, 0.5)),
         p5: Math.round(percentile(sorted, 0.05)),
      });
   });

   return null;
}

interface LoadedArtifactModel {
   readonly key: string;
   readonly object: Object3D;
}

function ArtifactModel({
   artifact,
   resolveAssetUrl,
   lifecycleRefs,
   onProgress,
   onError,
}: Readonly<{
   artifact: XRVitrineArtifact;
   resolveAssetUrl: (path: string) => string;
   lifecycleRefs: LifecycleRefs;
   onProgress: (progress: number | null) => void;
   onError: (message: string | null) => void;
}>) {
   // Tagged with the artifact it belongs to. Holding a bare Object3D meant that
   // switching artifacts kept rendering the PREVIOUS one for the whole load —
   // seconds for a multi-megabyte Draco GLB on a phone — so opening the drum,
   // going back and opening the mask showed the drum until the mask landed, and
   // kept showing it after the cleanup below had already disposed its GPU
   // resources. Comparing the tag at render time fixes that without clearing
   // state inside the effect, which would cascade a render
   // (react-hooks/set-state-in-effect).
   const [loaded, setLoaded] = useState<LoadedArtifactModel | null>(null);
   const modelKey = `${artifact.slug}|${artifact.modelUrl}`;

   useEffect(() => {
      let active = true;
      let dispose: (() => void) | null = null;
      onProgress(0);
      onError(null);

      void loadArtifactModel({
         modelPath: resolveAssetUrl(artifact.modelUrl),
         // An empty resolved decoder URL deliberately selects DRACOLoader's
         // module-bundled decoder. Next resolves this to its maintained public copy.
         dracoDecoderPath: resolveAssetUrl(DRACO_DECODER_ASSET_PATH),
         isCancelled: () => !active || !lifecycleRefs.acceptingRef.current,
         onProgress,
      })
         .then((loaded) => {
            if (!active || !lifecycleRefs.acceptingRef.current) {
               loaded.dispose();
               return;
            }
            dispose = loaded.dispose;
            lifecycleRefs.disposeModelRef.current = loaded.dispose;
            setLoaded({ key: modelKey, object: loaded.model });
            onProgress(100);
         })
         .catch((error: unknown) => {
            if (!active || !lifecycleRefs.acceptingRef.current) return;
            onError(formatError(error));
         });

      return () => {
         active = false;
         if (lifecycleRefs.disposeModelRef.current === dispose) {
            lifecycleRefs.disposeModelRef.current = null;
         }
         dispose?.();
      };
   }, [
      artifact.modelUrl,
      artifact.slug,
      lifecycleRefs,
      modelKey,
      onError,
      onProgress,
      resolveAssetUrl,
   ]);

   // Render only a model that belongs to the artifact currently being shown.
   return loaded?.key === modelKey ? <primitive object={loaded.object} /> : null;
}

function PlacementContents({
   artifact,
   nudge,
   resolveAssetUrl,
   lifecycleRefs,
   onModelProgress,
   onModelError,
}: Readonly<{
   artifact: XRVitrineArtifact;
   nudge: VitrineNudge;
   resolveAssetUrl: (path: string) => string;
   lifecycleRefs: LifecycleRefs;
   onModelProgress: (progress: number | null) => void;
   onModelError: (message: string | null) => void;
}>) {
   return (
      // Exact hierarchy: placement root -> marker extrinsic -> nudge -> presentation -> model.
      <group>
         <group
            position={[nudge.x, nudge.y, nudge.z]}
            rotation={[0, nudge.yaw, 0]}
         >
            <group
               scale={artifact.heightMetres}
               rotation={[0, artifact.rotationY, 0]}
            >
               <ArtifactModel
                  key={artifact.slug}
                  artifact={artifact}
                  resolveAssetUrl={resolveAssetUrl}
                  lifecycleRefs={lifecycleRefs}
                  onProgress={onModelProgress}
                  onError={onModelError}
               />
            </group>
         </group>
      </group>
   );
}

function AnchorVisibilityProbe({
   root,
   placement,
   onVisibility,
}: Readonly<{
   root: MutableRefObject<AnchorSpaceGroup | null>;
   placement: Placement;
   onVisibility: (visible: boolean, unlocatableFrames: number) => void;
}>) {
   const previous = useRef<boolean | null>(null);
   const unlocatableFramesRef = useRef(0);
   const reportedAtRef = useRef(0);

   useEffect(() => {
      previous.current = null;
      unlocatableFramesRef.current = 0;
      reportedAtRef.current = 0;
   }, [placement]);

   useFrame(() => {
      const anchorRoot = root.current;
      // XRSpace owns hiding when the anchor cannot be located. Observe both its
      // transform readiness and visibility so the DOM state follows that behavior.
      const visible = anchorRoot?.transformReady === true && anchorRoot.visible;
      if (!visible) unlocatableFramesRef.current += 1;
      const now = performance.now();
      if (visible === previous.current && now - reportedAtRef.current < 500)
         return;
      previous.current = visible;
      reportedAtRef.current = now;
      onVisibility(visible, unlocatableFramesRef.current);
   }, -90);

   return null;
}

function PlacementRoot({
   placement,
   artifact,
   nudge,
   resolveAssetUrl,
   lifecycleRefs,
   onAnchorVisibility,
   onModelProgress,
   onModelError,
}: Readonly<{
   placement: Placement;
   artifact: XRVitrineArtifact;
   nudge: VitrineNudge;
   resolveAssetUrl: (path: string) => string;
   lifecycleRefs: LifecycleRefs;
   onAnchorVisibility: (visible: boolean, unlocatableFrames: number) => void;
   onModelProgress: (progress: number | null) => void;
   onModelError: (message: string | null) => void;
}>) {
   const anchorRoot = useRef<AnchorSpaceGroup | null>(null);
   useFrame(() => {
      if (placement.kind !== 'anchored') return;
      const root = anchorRoot.current;
      if (root) root.visible = root.transformReady === true;
   }, -91);
   const fixedMatrix = useMemo(
      () =>
         placement.kind === 'fixed'
            ? new Matrix4().fromArray(placement.pose.matrix)
            : null,
      [placement]
   );
   const contents = (
      <PlacementContents
         artifact={artifact}
         nudge={nudge}
         resolveAssetUrl={resolveAssetUrl}
         lifecycleRefs={lifecycleRefs}
         onModelProgress={onModelProgress}
         onModelError={onModelError}
      />
   );

   if (placement.kind === 'anchored') {
      return (
         <XRSpace ref={anchorRoot} space={placement.space}>
            <AnchorVisibilityProbe
               root={anchorRoot}
               placement={placement}
               onVisibility={onAnchorVisibility}
            />
            {contents}
         </XRSpace>
      );
   }

   return (
      <group matrixAutoUpdate={false} matrix={fixedMatrix ?? undefined}>
         {contents}
      </group>
   );
}

function HitTestPlacement({
   resources,
   placement,
   artifact,
   nudge,
   placementPolicyRef,
   placementRequestedRef,
   lifecycleRefs,
   resolveAssetUrl,
   onPlacement,
   onPlacementMessage,
   onReticleVisibility,
   onAnchorVisibility,
   onModelProgress,
   onModelError,
}: Readonly<{
   resources: SessionResources;
   placement: Placement | null;
   artifact: XRVitrineArtifact;
   nudge: VitrineNudge;
   placementPolicyRef: MutableRefObject<PlacementPolicy>;
   placementRequestedRef: MutableRefObject<boolean>;
   lifecycleRefs: LifecycleRefs;
   resolveAssetUrl: (path: string) => string;
   onPlacement: (placement: Placement) => void;
   onPlacementMessage: (message: string) => void;
   onReticleVisibility: (visible: boolean) => void;
   onAnchorVisibility: (visible: boolean, unlocatableFrames: number) => void;
   onModelProgress: (progress: number | null) => void;
   onModelError: (message: string | null) => void;
}>) {
   const reticle = useRef<Group | null>(null);
   const placementPending = useRef(false);
   const previousReticleVisibility = useRef(false);
   const matrix = useMemo(() => new Matrix4(), []);
   const surfaceY = useMemo(() => new Vector3(), []);
   const localFloorUp = useMemo(() => new Vector3(0, 1, 0), []);

   useFrame((_state, _delta, frame) => {
      if (!frame || !lifecycleRefs.acceptingRef.current) {
         if (reticle.current) reticle.current.visible = false;
         if (previousReticleVisibility.current) {
            previousReticleVisibility.current = false;
            onReticleVisibility(false);
         }
         return;
      }

      let qualifyingResult: XRHitTestResult | null = null;
      let qualifyingPose: LocalFloorPose | null = null;
      const results = frame.getHitTestResults(resources.hitTestSource);
      for (const result of results) {
         const pose = result.getPose(resources.localFloorSpace);
         if (!pose) continue;
         const candidate = pose.transform.matrix;
         surfaceY.set(candidate[4] ?? 0, candidate[5] ?? 0, candidate[6] ?? 0);
         const length = surfaceY.length();
         const upDot =
            length > 0
               ? surfaceY.multiplyScalar(1 / length).dot(localFloorUp)
               : -1;
         if (upDot < MIN_SURFACE_UP_DOT) continue;
         qualifyingResult = result;
         qualifyingPose = { matrix: new Float32Array(candidate) };
         matrix.fromArray(candidate);
         break;
      }

      const reticleVisible = qualifyingPose !== null;
      if (reticle.current) {
         reticle.current.visible = reticleVisible;
         if (qualifyingPose !== null) reticle.current.matrix.copy(matrix);
      }
      if (reticleVisible !== previousReticleVisibility.current) {
         previousReticleVisibility.current = reticleVisible;
         onReticleVisibility(reticleVisible);
      }

      if (!placementRequestedRef.current || placementPending.current) return;
      placementRequestedRef.current = false;
      if (!qualifyingResult || !qualifyingPose) {
         onPlacementMessage(
            'No upward-facing hit within 20° was available on that frame.'
         );
         return;
      }

      placementPending.current = true;
      const resultForAnchor = qualifyingResult;
      const createHitTestAnchor = resultForAnchor.createAnchor;
      void commitPlacement({
         pose: qualifyingPose,
         source: 'hit-test',
         createAnchor:
            placementPolicyRef.current === 'anchor' && createHitTestAnchor
               ? () => createHitTestAnchor.call(resultForAnchor)
               : null,
         fallback: 'fixed',
      })
         .then((nextPlacement) => {
            if (!lifecycleRefs.acceptingRef.current) {
               nextPlacement.release();
               return;
            }
            onPlacement(nextPlacement);
         })
         .catch((error: unknown) => {
            if (lifecycleRefs.acceptingRef.current)
               onPlacementMessage(formatError(error));
         })
         .finally(() => {
            placementPending.current = false;
         });
   }, -80);

   return (
      <>
         <group ref={reticle} matrixAutoUpdate={false} visible={false}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
               <ringGeometry args={[0.055, 0.07, 48]} />
               <meshBasicMaterial
                  color="#fb923c"
                  transparent
                  opacity={0.92}
                  depthTest={false}
               />
            </mesh>
         </group>
         {placement && (
            <PlacementRoot
               placement={placement}
               artifact={artifact}
               nudge={nudge}
               resolveAssetUrl={resolveAssetUrl}
               lifecycleRefs={lifecycleRefs}
               onAnchorVisibility={onAnchorVisibility}
               onModelProgress={onModelProgress}
               onModelError={onModelError}
            />
         )}
      </>
   );
}

function XRScene({
   store,
   resources,
   artifact,
   options,
   placement,
   placementPolicyRef,
   placementRequestedRef,
   lifecycleRefs,
   resolveAssetUrl,
   sessionFeatures,
   vitrineState,
   renderOverlay,
   onPlacement,
   onPlacementMessage,
   onReticleVisibility,
   onAnchorVisibility,
   onModelProgress,
   onModelError,
   onFps,
}: Readonly<{
   store: XRStore;
   resources: SessionResources | null;
   artifact: XRVitrineArtifact;
   options: XRVitrineOptions;
   placement: Placement | null;
   placementPolicyRef: MutableRefObject<PlacementPolicy>;
   placementRequestedRef: MutableRefObject<boolean>;
   lifecycleRefs: LifecycleRefs;
   resolveAssetUrl: (path: string) => string;
   sessionFeatures: SessionFeatureInfo;
   vitrineState: VitrineState;
   renderOverlay: (state: VitrineState) => ReactNode;
   onPlacement: (placement: Placement) => void;
   onPlacementMessage: (message: string) => void;
   onReticleVisibility: (visible: boolean) => void;
   onAnchorVisibility: (visible: boolean, unlocatableFrames: number) => void;
   onModelProgress: (progress: number | null) => void;
   onModelError: (message: string | null) => void;
   onFps: (fps: VitrineFps) => void;
}>) {
   return (
      <XR store={store}>
         {/* An artifact in AR is composited over a live camera feed, so it is judged
          against whatever the room's real brightness is — lighting that looks
          correct on a dark canvas reads as murky against a lit gallery. These
          are deliberately hotter than a normal scene would want, and the two
          lower fills exist to stop the underside of a tall object going black,
          which is what made the drum look dim from a standing viewpoint. */}
         <hemisphereLight args={[0xfff2da, 0x4a3020, 3.2]} />
         <ambientLight color={0xfff4e4} intensity={0.9} />
         <directionalLight
            color={0xffffff}
            intensity={3.2}
            position={[1.5, 2.5, 2]}
         />
         <directionalLight
            color={0xffc16b}
            intensity={1.8}
            position={[-2, 1, 1]}
         />
         {/* Rim from behind, so the silhouette separates from the camera feed. */}
         <directionalLight
            color={0xffe6c2}
            intensity={1.1}
            position={[0, 1.5, -2.5]}
         />
         {/* Bounce, standing in for light coming back off the plinth. */}
         <directionalLight
            color={0xffd9a8}
            intensity={0.7}
            position={[0, -1.5, 0.5]}
         />
         {resources && (
            <>
               <HitTestPlacement
                  resources={resources}
                  placement={placement}
                  artifact={artifact}
                  nudge={options.nudge ?? ZERO_NUDGE}
                  placementPolicyRef={placementPolicyRef}
                  placementRequestedRef={placementRequestedRef}
                  lifecycleRefs={lifecycleRefs}
                  resolveAssetUrl={resolveAssetUrl}
                  onPlacement={onPlacement}
                  onPlacementMessage={onPlacementMessage}
                  onReticleVisibility={onReticleVisibility}
                  onAnchorVisibility={onAnchorVisibility}
                  onModelProgress={onModelProgress}
                  onModelError={onModelError}
               />
               {options.enableFpsSampling && <FpsProbe onFps={onFps} />}
               {options.cameraAccessProbe?.({
                  session: resources.session,
                  localFloorSpace: resources.localFloorSpace,
                  sessionFeatures,
               })}
               <XRDomOverlay>{renderOverlay(vitrineState)}</XRDomOverlay>
            </>
         )}
      </XR>
   );
}

function XRVitrineInstance({
   artifact,
   options,
   resolveAssetUrl,
   renderUnsupported,
   renderStart,
   renderOverlay,
   initialFailure,
   onSessionEnded,
}: XRVitrineProps &
   Readonly<{
      initialFailure: UnsupportedReason | null;
      onSessionEnded: (reason: UnsupportedReason) => void;
   }>) {
   const acceptingRef = useRef(true);
   const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
   const placementRef = useRef<Placement | null>(null);
   const retiredPlacementRef = useRef<Placement | null>(null);
   const disposeModelRef = useRef<(() => void) | null>(null);
   const lifecycleRefs = useMemo<LifecycleRefs>(
      () => ({ acceptingRef, disposeModelRef }),
      []
   );
   const [store, setStore] = useState<XRStore | null>(null);
   const storeRef = useRef<XRStore | null>(null);
   const [capability, setCapability] = useState<CapabilityState>({
      kind: 'checking',
   });
   const [failure, setFailure] = useState<UnsupportedReason | null>(
      initialFailure
   );
   const [entering, setEntering] = useState(false);
   const [startRequestVersion, setStartRequestVersion] = useState(0);
   const handledStartRequestRef = useRef(0);
   const [resources, setResources] = useState<SessionResources | null>(null);
   const [placement, setPlacement] = useState<Placement | null>(null);
   const [placementPolicy, setPlacementPolicy] =
      useState<PlacementPolicy>('anchor');
   const placementPolicyRef = useRef(placementPolicy);
   const placementRequestedRef = useRef(false);
   const [placementMessage, setPlacementMessage] = useState(
      'Point at a flat surface until the circle appears, then tap.'
   );
   const [anchorLocatable, setAnchorLocatable] = useState<boolean | null>(null);
   const [anchorUnlocatableFrames, setAnchorUnlocatableFrames] = useState(0);
   const [reticleVisible, setReticleVisible] = useState(false);
   const [modelProgress, setModelProgress] = useState<number | null>(0);
   const [modelError, setModelError] = useState<string | null>(null);
   const [fps, setFps] = useState<VitrineFps>(ZERO_FPS);
   const endReasonRef = useRef<UnsupportedReason>(SESSION_ENDED_REASON);
   const disposeSessionListenersRef = useRef<(() => void) | null>(null);
   const shutdownPromiseRef = useRef<Promise<void> | null>(null);
   const cameraAccessProbeEnabled = options.cameraAccessProbe !== undefined;
   const optionalFeatures = useMemo(
      () => [
         ...BASE_OPTIONAL_FEATURES,
         ...(cameraAccessProbeEnabled ? (['camera-access'] as const) : []),
      ],
      [cameraAccessProbeEnabled]
   );
   const sessionFeatures = useMemo<SessionFeatureInfo>(
      () => ({
         required: REQUIRED_FEATURES,
         optional: optionalFeatures,
         granted: resources?.session.enabledFeatures
            ? [...resources.session.enabledFeatures]
            : null,
         domOverlayType: resources?.session.domOverlayState?.type ?? null,
      }),
      [optionalFeatures, resources]
   );

   const beginShutdown = useCallback(() => {
      const existing = shutdownPromiseRef.current;
      if (existing) return existing;

      acceptingRef.current = false;
      placementRequestedRef.current = false;
      disposeSessionListenersRef.current?.();
      disposeSessionListenersRef.current = null;
      hitTestSourceRef.current?.cancel();
      hitTestSourceRef.current = null;
      placementRef.current?.release();
      placementRef.current = null;
      retiredPlacementRef.current?.release();
      retiredPlacementRef.current = null;
      disposeModelRef.current?.();
      disposeModelRef.current = null;

      const activeSession = storeRef.current?.getState().session;
      const shutdown = activeSession
         ? activeSession.end().catch(() => undefined)
         : Promise.resolve();
      shutdownPromiseRef.current = shutdown;
      return shutdown;
   }, []);

   useLayoutEffect(
      () => () => {
         void beginShutdown();
      },
      [beginShutdown]
   );

   useEffect(() => {
      placementPolicyRef.current = placementPolicy;
   }, [placementPolicy]);

   useLayoutEffect(() => {
      retiredPlacementRef.current?.release();
      retiredPlacementRef.current = null;
   }, [placement]);

   useEffect(() => {
      shutdownPromiseRef.current = null;
      acceptingRef.current = true;
      const placeholderRoot = document.createElement('div');
      const customSessionInit: XRSessionInit = {
         requiredFeatures: [...REQUIRED_FEATURES],
         optionalFeatures: [...optionalFeatures],
         domOverlay: { root: placeholderRoot },
      };
      const createdStore = createXRStore({
         emulate: false,
         offerSession: false,
         enterGrantedSession: false,
         hitTest: 'required',
         domOverlay: 'required',
         anchors: true,
         handTracking: false,
         bodyTracking: false,
         layers: false,
         planeDetection: false,
         meshDetection: false,
         depthSensing: false,
         hand: false,
         controller: false,
         transientPointer: false,
         gaze: false,
         screenInput: false,
         customSessionInit,
      });
      const overlayRoot = createdStore.getState().domOverlayRoot;
      if (overlayRoot) customSessionInit.domOverlay = { root: overlayRoot };
      storeRef.current = createdStore;
      let mounted = true;
      queueMicrotask(() => {
         if (mounted) setStore(createdStore);
      });

      let destroyed = false;
      return () => {
         mounted = false;
         const shutdown = beginShutdown();
         void shutdown.finally(() => {
            if (destroyed) return;
            destroyed = true;
            createdStore.destroy();
            if (storeRef.current === createdStore) storeRef.current = null;
         });
      };
   }, [beginShutdown, optionalFeatures]);

   useEffect(() => {
      let active = true;
      const checkCapability = async () => {
         if (!window.isSecureContext) {
            setCapability({
               kind: 'blocked',
               reason: {
                  kind: 'insecure-context',
                  message:
                     'WebXR requires a secure context (HTTPS or same-device localhost).',
               },
            });
            return;
         }
         if (!navigator.xr) {
            setCapability({
               kind: 'blocked',
               reason: {
                  kind: 'missing-webxr',
                  message: 'navigator.xr is missing in this browser.',
               },
            });
            return;
         }
         try {
            const supported =
               await navigator.xr.isSessionSupported('immersive-ar');
            if (!active) return;
            setCapability(
               supported
                  ? { kind: 'ready' }
                  : {
                       kind: 'blocked',
                       reason: {
                          kind: 'immersive-ar-unsupported',
                          message:
                             'immersive-ar is not supported on this device/browser.',
                       },
                    }
            );
         } catch (error) {
            if (!active) return;
            setCapability({
               kind: 'blocked',
               reason: {
                  kind: 'capability-check-failed',
                  message: `Capability check failed (${formatError(error)}).`,
               },
            });
         }
      };
      void checkCapability();
      return () => {
         active = false;
      };
   }, []);

   const installPlacement = useCallback((next: Placement) => {
      if (!acceptingRef.current) {
         next.release();
         return;
      }
      const previous = placementRef.current;
      placementRef.current = next;
      retiredPlacementRef.current = previous;
      setPlacement(next);
      setAnchorLocatable(next.kind === 'anchored' ? null : true);
      setAnchorUnlocatableFrames(0);
      setPlacementMessage(
         next.kind === 'anchored'
            ? 'Anchor created from this frame’s native hit-test result.'
            : `Placed with a fixed local-floor pose: ${next.reason}.`
      );
   }, []);

   const handleStart = useCallback(async () => {
      const currentStore = storeRef.current;
      if (!currentStore || capability.kind !== 'ready' || entering) return;
      setEntering(true);
      setFailure(null);
      endReasonRef.current = SESSION_ENDED_REASON;

      try {
         const session = await currentStore.enterAR();
         if (!session) throw new Error('The XR store returned no session.');

         const handleEnd = () => {
            acceptingRef.current = false;
            onSessionEnded(endReasonRef.current);
         };
         session.addEventListener('end', handleEnd, { once: true });
         disposeSessionListenersRef.current = () => {
            session.removeEventListener('end', handleEnd);
         };

         const failAfterEntry = async (reason: UnsupportedReason) => {
            endReasonRef.current = reason;
            await session.end().catch(() => undefined);
         };

         if (!session.domOverlayState) {
            await failAfterEntry({
               kind: 'dom-overlay-unavailable',
               message:
                  'DOM overlay was not granted for the immersive AR session.',
            });
            return;
         }

         let viewerSpace: XRReferenceSpace;
         let localFloorSpace: XRReferenceSpace;
         let hitTestSource: XRHitTestSource | undefined;
         try {
            [viewerSpace, localFloorSpace] = await Promise.all([
               session.requestReferenceSpace('viewer'),
               session.requestReferenceSpace('local-floor'),
            ]);
            const request = session.requestHitTestSource?.({
               space: viewerSpace,
               entityTypes: ['plane', 'mesh'],
            });
            hitTestSource = request ? await request : undefined;
         } catch (error) {
            await failAfterEntry({
               kind: 'hit-test-unavailable',
               message: `Viewer-space hit-test setup failed (${formatError(
                  error
               )}).`,
            });
            return;
         }

         if (!hitTestSource) {
            await failAfterEntry({
               kind: 'hit-test-unavailable',
               message:
                  'The browser could not create a viewer-space hit-test source.',
            });
            return;
         }

         hitTestSourceRef.current = hitTestSource;
         setResources({ session, hitTestSource, localFloorSpace });
         setPlacementMessage(
            'Point at a flat surface until the circle appears, then tap.'
         );

         const requestPlacement = () => {
            if (acceptingRef.current) placementRequestedRef.current = true;
         };
         session.addEventListener('select', requestPlacement);
         disposeSessionListenersRef.current = () => {
            session.removeEventListener('end', handleEnd);
            session.removeEventListener('select', requestPlacement);
         };
      } catch (error) {
         setFailure(entryFailure(error));
      } finally {
         if (acceptingRef.current) setEntering(false);
      }
   }, [capability.kind, entering, onSessionEnded]);

   useEffect(() => {
      if (
         startRequestVersion === 0 ||
         handledStartRequestRef.current === startRequestVersion
      ) {
         return;
      }
      handledStartRequestRef.current = startRequestVersion;
      void handleStart();
   }, [handleStart, startRequestVersion]);

   const requestStart = useCallback(() => {
      setStartRequestVersion((current) => current + 1);
   }, []);

   const endSession = useCallback(() => {
      void storeRef.current
         ?.getState()
         .session?.end()
         .catch(() => undefined);
   }, []);

   const placementKind = placement?.kind ?? 'unplaced';
   const state = useMemo<VitrineState>(
      () => ({
         placementKind,
         placementReason: placement?.kind === 'fixed' ? placement.reason : null,
         placementMessage,
         placementPolicy,
         setPlacementPolicy,
         anchorLocatable,
         anchorUnlocatableFrames,
         reticleVisible,
         modelProgress,
         modelError,
         fps,
         sessionFeatures,
         endSession,
      }),
      [
         anchorLocatable,
         anchorUnlocatableFrames,
         endSession,
         fps,
         modelError,
         modelProgress,
         placement,
         placementKind,
         placementMessage,
         placementPolicy,
         reticleVisible,
         sessionFeatures,
      ]
   );

   const unavailableReason =
      capability.kind === 'checking'
         ? ({
              kind: 'checking',
              message: 'Checking immersive AR support…',
           } as const)
         : capability.kind === 'blocked'
         ? capability.reason
         : failure
         ? { ...failure, retry: requestStart }
         : store === null
         ? ({
              kind: 'checking',
              message: 'Preparing the immersive AR viewer…',
           } as const)
         : null;

   return (
      <>
         {store && (
            <Canvas
               style={{
                  position: 'fixed',
                  inset: 0,
                  width: '100vw',
                  height: '100dvh',
                  touchAction: 'none',
               }}
               gl={{ alpha: true, antialias: true }}
               camera={{ near: 0.01, far: 50 }}
               onCreated={({ gl }) => {
                  gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                  gl.setClearColor(0x000000, 0);
               }}
            >
               <XRScene
                  store={store}
                  resources={resources}
                  artifact={artifact}
                  options={options}
                  placement={placement}
                  placementPolicyRef={placementPolicyRef}
                  placementRequestedRef={placementRequestedRef}
                  lifecycleRefs={lifecycleRefs}
                  resolveAssetUrl={resolveAssetUrl}
                  sessionFeatures={sessionFeatures}
                  vitrineState={state}
                  renderOverlay={renderOverlay}
                  onPlacement={installPlacement}
                  onPlacementMessage={setPlacementMessage}
                  onReticleVisibility={setReticleVisible}
                  onAnchorVisibility={(visible, unlocatableFrames) => {
                     setAnchorLocatable(visible);
                     setAnchorUnlocatableFrames(unlocatableFrames);
                     setPlacementMessage(
                        visible ? 'Anchor located.' : 'Anchor unlocatable.'
                     );
                  }}
                  onModelProgress={setModelProgress}
                  onModelError={setModelError}
                  onFps={setFps}
               />
            </Canvas>
         )}

         {!resources &&
            (unavailableReason
               ? renderUnsupported(unavailableReason)
               : renderStart(requestStart))}
      </>
   );
}

export function XRVitrine(props: XRVitrineProps) {
   const [generation, setGeneration] = useState(0);
   const [failure, setFailure] = useState<UnsupportedReason | null>(null);
   const handleSessionEnded = useCallback((reason: UnsupportedReason) => {
      setFailure(reason);
      setGeneration((current) => current + 1);
   }, []);

   return (
      <XRVitrineInstance
         key={generation}
         {...props}
         initialFailure={failure}
         onSessionEnded={handleSessionEnded}
      />
   );
}
