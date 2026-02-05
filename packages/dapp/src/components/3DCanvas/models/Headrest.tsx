import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
   nodes: {
      head_rest: THREE.Mesh;
      tart: THREE.Mesh;
   };
   materials: {
      Material: THREE.MeshStandardMaterial;
      wire_204204204: THREE.MeshStandardMaterial;
   };
};

// Euler rotation
const ROTATION = new THREE.Euler(Math.PI / 2, 0, 0);

export function Headrest(props: JSX.IntrinsicElements['group']) {
   const group = useRef<THREE.Group>(null);
   const { nodes, materials } = useGLTF('/models/headrest.glb') as GLTFResult;

   // Optimize static materials
   React.useMemo(() => {
      materials.Material.roughness = 0.7;
      materials.Material.envMapIntensity = 1;
      materials.wire_204204204.roughness = 0.5;
      materials.wire_204204204.envMapIntensity = 1;
   }, [materials]);

   return (
      <group ref={group} {...props} dispose={null}>
         <mesh
            geometry={nodes.head_rest.geometry}
            material={materials.Material}
            rotation={ROTATION}
            castShadow
            receiveShadow
            matrixAutoUpdate={false}
            onUpdate={(self) => {
               self.updateMatrix();
            }}
         />
         <mesh
            geometry={nodes.tart.geometry}
            material={materials.wire_204204204}
            rotation={ROTATION}
            castShadow
            receiveShadow
            matrixAutoUpdate={false}
            onUpdate={(self) => {
               self.updateMatrix();
            }}
         />
      </group>
   );
}

// Only preload if this is the primary model being displayed
const modelPath = '/models/headrest.glb';
if (typeof window !== 'undefined') {
   useGLTF.preload(modelPath);
}
