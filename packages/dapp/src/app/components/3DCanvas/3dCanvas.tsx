'use client';
import React, { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DirectionalLight } from 'three';

interface SummitShareCanvasProps {
  children: ReactNode;
}

const SummitShareCanvas: React.FC<SummitShareCanvasProps> = ({ children }) => {
  return (
    <div className="bg-primary-50 from-orange-600 to-orange-400 h-[360px] w-full rounded-[8px]">
      <Canvas
        frameloop="demand"
        shadows
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 1000 }} // Centered camera position
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Add Directional Light */}
        <directionalLight
          intensity={5} // Adjust the intensity as needed
          position={[5, 10, 5]} // Adjust the position as needed
        />

        <ambientLight intensity={5} />

        {children}

        {/* Add OrbitControls to enable camera rotation around the object */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={7} // Minimum distance from the object
          maxDistance={20} // Maximum distance from the object
          target={[0, 0, 0]} // Set the target to the object's position
        />
      </Canvas>
    </div>
  );
};

export default SummitShareCanvas;
