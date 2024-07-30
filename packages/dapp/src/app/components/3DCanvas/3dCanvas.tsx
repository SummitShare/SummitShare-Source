import React, { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface SummitShareCanvasProps {
  children: ReactNode;
}

// Main component function
const SummitShareCanvas: React.FC<SummitShareCanvasProps> = ({ children }) => {
  return (
    // Container div with background colors and dimensions
    <div className="bg-primary-50 from-orange-600 to-orange-400 h-[360px] w-full rounded-[8px]">
      {/* Three.js canvas setup */}
      <Canvas
        frameloop="demand" // Only re-render the canvas when necessary
        shadows // Enable shadow mapping
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 1000 }} // Camera settings
        gl={{ preserveDrawingBuffer: true }} // Preserve buffer for screenshot purposes
      >
        {/* Directional light to simulate sunlight */}
        <directionalLight
          intensity={5} // Light intensity
          position={[5, 10, 5]} // Light position
        />

        {/* Ambient light to provide general illumination */}
        <ambientLight intensity={5} />

        {/* Render children components (3D objects) */}
        {children}

        {/* Controls to enable camera interaction */}
        <OrbitControls
          enableZoom={true} // Allow zooming
          enablePan={false} // Disable panning
          minDistance={7} // Minimum distance from the object
          maxDistance={20} // Maximum distance from the object
          target={[0, 0, 0]} // Set the target to the object's position
        />
      </Canvas>
    </div>
  );
};

export default SummitShareCanvas;
