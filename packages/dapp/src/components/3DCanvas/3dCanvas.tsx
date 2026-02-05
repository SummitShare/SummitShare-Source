import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
   OrbitControls,
   AdaptiveDpr,
   AdaptiveEvents,
   BakeShadows,
   Preload,
   useProgress,
   Center,
} from '@react-three/drei';
import * as THREE from 'three';

// Declare global type for the renderer
declare global {
   interface Window {
      __THREEJS_RENDERER__?: THREE.WebGLRenderer;
   }
}

/**
 * CanvasLoader is a functional component that displays a loading screen
 * with a spinning animation and progress information.
 *
 * It uses the `useProgress` hook to get the current loading progress and
 * displays a message based on the progress value.
 *
 * @returns {JSX.Element} A JSX element representing the loading screen.
 */
const CanvasLoader = () => {
   const { progress } = useProgress();

   return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f0c09]/90 rounded-2xl">
         <div className="flex flex-col items-center gap-3 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-300 border-t-transparent" />
            <div className="flex flex-col items-center gap-1">
               <p className="text-lg text-amber-100">
                  Loading Artifact... {Math.round(progress)}%
               </p>
               <p className="text-sm text-amber-200/70">
                  {progress >= 50
                     ? 'Grabbing history from chain...'
                     : 'Finding your artifact...'}
               </p>
            </div>
         </div>
      </div>
   );
};

interface DynamicCanvasProps {
   children: React.ReactNode;
}

const DynamicCanvas: React.FC<DynamicCanvasProps> = ({ children }) => {
   const [isVisible, setIsVisible] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [dpr, setDpr] = useState(1);
   const { progress } = useProgress();

   useEffect(() => {
      // Consider loading complete when progress reaches 100%
      if (progress === 100) {
         const timer = setTimeout(() => {
            setIsLoading(false);
         }, 500);
         return () => clearTimeout(timer);
      }
   }, [progress]);

   useEffect(() => {
      const updateDpr = () => {
         if (typeof window === 'undefined') return;
         const isMobile = window.innerWidth < 768;
         const nextDpr = isMobile ? 1 : Math.min(1.5, window.devicePixelRatio);
         setDpr(nextDpr);
      };

      updateDpr();
      window.addEventListener('resize', updateDpr);
      return () => window.removeEventListener('resize', updateDpr);
   }, []);

   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            setIsVisible(entry.isIntersecting);
         },
         {
            root: null,
            rootMargin: '100px',
            threshold: 0.1,
         }
      );

      const element = document.getElementById('canvas-container');
      if (element) {
         observer.observe(element);
      }

      return () => {
         if (element) {
            observer.unobserve(element);
         }
      };
   }, []);

   // Memory cleanup
   useEffect(() => {
      return () => {
         if (typeof window !== 'undefined' && window.__THREEJS_RENDERER__) {
            window.__THREEJS_RENDERER__.dispose();
            THREE.Cache.clear();
            delete window.__THREEJS_RENDERER__;
         }
      };
   }, []);

   return (
      <div
         id="canvas-container"
         className="relative isolate h-[360px] w-full overflow-hidden rounded-2xl bg-[#0f0c09] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.8)]"
      >
         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,210,160,0.25),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(255,120,0,0.18),_transparent_55%)]" />
         {isLoading && <CanvasLoader />}

         {isVisible && (
            <Suspense fallback={<CanvasLoader />}>
               <Canvas
                  frameloop={isVisible ? 'always' : 'demand'}
                  shadows
                  camera={{
                     position: [0, 0.2, 8.5],
                     fov: 42,
                     near: 0.1,
                     far: 200,
                  }}
                  gl={{
                     antialias: true,
                     alpha: false,
                     stencil: false,
                     depth: true,
                     powerPreference: 'high-performance',
                     logarithmicDepthBuffer: true,
                  }}
                  onCreated={({ gl }) => {
                     if (typeof window !== 'undefined') {
                        window.__THREEJS_RENDERER__ = gl;
                     }
                  }}
                  dpr={dpr}
                  performance={{ min: 0.5 }}
               >
                  <color attach="background" args={['#0f0c09']} />

                  <AdaptiveDpr pixelated />
                  <AdaptiveEvents />
                  <BakeShadows />

                  <ambientLight intensity={1.15} />
                  <hemisphereLight
                     intensity={1.15}
                     color="#f6e7d1"
                     groundColor="#2b1a10"
                  />
                  <spotLight
                     intensity={2.8}
                     position={[6, 8, 4]}
                     angle={0.45}
                     penumbra={0.6}
                     castShadow
                     shadow-mapSize-width={512}
                     shadow-mapSize-height={512}
                  />

                  <Center>{children}</Center>

                  <Preload all />

                  <OrbitControls
                     enableZoom={true}
                     enablePan={false}
                     minDistance={8}
                     maxDistance={18}
                     target={[0, 0, 0]}
                     enableDamping={true}
                     dampingFactor={0.05}
                     rotateSpeed={0.5}
                     zoomSpeed={0.5}
                     autoRotate
                     autoRotateSpeed={0.6}
                  />
               </Canvas>
            </Suspense>
         )}

         <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs text-amber-100/80 backdrop-blur-sm">
            Drag to rotate
         </div>
      </div>
   );
};

export default DynamicCanvas;
