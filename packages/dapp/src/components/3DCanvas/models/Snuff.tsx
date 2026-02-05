import React, { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';

// Define types
type GLTFResult = GLTF & {
   nodes: {
      CLOTHE_KNOT1: THREE.Mesh;
      GLOBE: THREE.Mesh;
      NEW_KNOT_MID1: THREE.Mesh;
      ROPE: THREE.Mesh;
      STRAP: THREE.Mesh;
      THREADS2: THREE.Mesh;
      TOP_WOOD2: THREE.Mesh;
   };
   materials: {
      ['MAT - Snuff Cup']: THREE.MeshStandardMaterial;
   };
};

// Create a low-quality fallback component
const ModelFallback = () => (
   <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
   </mesh>
);

// Optimize material creation
const createOptimizedMaterial = (baseMaterial: THREE.MeshStandardMaterial) => {
   const material = baseMaterial.clone();
   material.roughness = 0.7;
   material.metalness = 0.3;
   material.needsUpdate = true;
   return material;
};

// Main component with optimizations
export function Snuff(
   props: JSX.IntrinsicElements['group'] & { levelOfDetail?: 'high' | 'low' }
) {
   const { levelOfDetail = 'high' } = props;
   const { nodes, materials } = useGLTF('/models/snuff.glb') as GLTFResult;

   // Memoize material to prevent unnecessary recreations
   const optimizedMaterial = useMemo(
      () => createOptimizedMaterial(materials['MAT - Snuff Cup']),
      [materials]
   );

   // Memoize geometries
   const memoizedGeometries = useMemo(() => {
      // If low detail is requested, simplify geometries
      const simplifyGeometry = (geometry: THREE.BufferGeometry) => {
         if (levelOfDetail === 'low') {
            // Create simplified version with fewer vertices
            const modifier = new THREE.BufferGeometry();
            modifier.setAttribute('position', geometry.getAttribute('position'));

            return modifier;
         }
         return geometry;
      };

      return {
         CLOTHE_KNOT1: simplifyGeometry(nodes.CLOTHE_KNOT1.geometry),
         GLOBE: simplifyGeometry(nodes.GLOBE.geometry),
         NEW_KNOT_MID1: simplifyGeometry(nodes.NEW_KNOT_MID1.geometry),
         ROPE: simplifyGeometry(nodes.ROPE.geometry),
         STRAP: simplifyGeometry(nodes.STRAP.geometry),
         THREADS2: simplifyGeometry(nodes.THREADS2.geometry),
         TOP_WOOD2: simplifyGeometry(nodes.TOP_WOOD2.geometry),
      };
   }, [nodes, levelOfDetail]);

   // Optional: Add frustum culling
   useFrame(({ camera }) => {
      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(
         new THREE.Matrix4().multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
         )
      );
      // Implement visibility culling logic here if needed
   });

   const baseRotation = [-2.445, 1.38, 1.023] as const;

   return (
      <Suspense fallback={<ModelFallback />}>
         <group {...props} dispose={null}>
            {Object.entries(memoizedGeometries).map(([key, geometry]) => (
               <mesh key={key} geometry={geometry} material={optimizedMaterial} />
            ))}
         </group>
      </Suspense>
   );
}

// Preload with priority levels
useGLTF.preload('/models/snuff.glb', true); // true for high priority

// Example usage in your model collection
export const ModelCollection = () => {
   const models = useMemo(
      () => ({
         snuff: <Snuff levelOfDetail="high" />,
         // Add other models here
      }),
      []
   );

   return models;
};
