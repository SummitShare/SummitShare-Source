import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';

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

const createOptimizedMaterial = (baseMaterial: THREE.MeshStandardMaterial) => {
   const material = baseMaterial.clone();
   material.roughness = 0.7;
   material.metalness = 0.3;
   material.needsUpdate = true;
   return material;
};

export function Snuff(props: ThreeElements['group']) {
   const { nodes, materials } = useGLTF(
      '/models/snuff.glb'
   ) as unknown as GLTFResult;

   const optimizedMaterial = useMemo(
      () => createOptimizedMaterial(materials['MAT - Snuff Cup']),
      [materials]
   );

   const meshes = useMemo(
      () => [
         { key: 'CLOTHE_KNOT1', geometry: nodes.CLOTHE_KNOT1.geometry },
         { key: 'GLOBE', geometry: nodes.GLOBE.geometry },
         { key: 'NEW_KNOT_MID1', geometry: nodes.NEW_KNOT_MID1.geometry },
         { key: 'ROPE', geometry: nodes.ROPE.geometry },
         { key: 'STRAP', geometry: nodes.STRAP.geometry },
         { key: 'THREADS2', geometry: nodes.THREADS2.geometry },
         { key: 'TOP_WOOD2', geometry: nodes.TOP_WOOD2.geometry },
      ],
      [nodes]
   );

   return (
      <group {...props} dispose={null}>
         {meshes.map(({ key, geometry }) => (
            <mesh key={key} geometry={geometry} material={optimizedMaterial} />
         ))}
      </group>
   );
}

useGLTF.preload('/models/snuff.glb');
