import React, { ReactNode } from "react";
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei";
import { DirectionalLight } from "three"; // Import DirectionalLight
// import { Drum } from "@/Drum";

const SummitShareCanvas = (modle:any)=> {
  return (
    <div className="bg-gradient-to-t from-orange-600 to-orange-400  h-[410px] w-[500px] rounded-xl">
      <Canvas
        frameloop="demand"
        shadows
        camera={{ position: [10, 10, 10], fov: 45, near: 0.1, far: 1000 }} // Adjust camera position and parameters
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Add Directional Light */}
        <directionalLight
          intensity={20} // Adjust the intensity as needed
          position={[5, 10, 5]} // Adjust the position as needed
          castShadow // Enable shadow casting
        />
 
        <ambientLight intensity={10} />

        {modle}

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
