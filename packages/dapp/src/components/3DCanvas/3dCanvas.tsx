import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
   OrbitControls,
   AdaptiveDpr,
   AdaptiveEvents,
   BakeShadows,
   Preload,
   useProgress,
   Html,
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
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary-50 rounded-[8px]">
         <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
            <div className="flex flex-col items-center gap-1">
               <p className="text-lg text-gray-700">
                  Loading Artifact... {Math.round(progress)}%
               </p>
               <p className="text-sm text-gray-500">
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
   const { progress, total } = useProgress();

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
         className="h-[360px] w-full rounded-[8px] bg-primary-50 relative"
      >
         {isLoading && <CanvasLoader />}

         {isVisible && (
            <Suspense fallback={<CanvasLoader />}>
               <Canvas
                  frameloop="demand"
                  shadows
                  camera={{
                     position: [0, 0, 10],
                     fov: 45,
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
                  dpr={[1, 1.5]}
                  performance={{ min: 0.5 }}
               >
                  <color attach="background" args={['#F5F5F1']} />

                  <AdaptiveDpr pixelated />
                  <AdaptiveEvents />
                  <BakeShadows />

                  <directionalLight
                     intensity={5}
                     position={[5, 10, 5]}
                     shadow-mapSize-width={512}
                     shadow-mapSize-height={512}
                     shadow-camera-far={20}
                     shadow-camera-near={0.1}
                     castShadow
                  />
                  <ambientLight intensity={5} />

                  {children}
                  <Preload all />

                  <OrbitControls
                     enableZoom={true}
                     enablePan={false}
                     minDistance={7}
                     maxDistance={20}
                     target={[0, 0, 0]}
                     enableDamping={true}
                     dampingFactor={0.05}
                     rotateSpeed={0.5}
                     zoomSpeed={0.5}
                  />
               </Canvas>
            </Suspense>
         )}
      </div>
   );
};

export default DynamicCanvas;
