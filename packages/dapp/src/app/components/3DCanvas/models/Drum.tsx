import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    BODY: THREE.Mesh
    COVERS: THREE.Mesh
    MID_PATTERN: THREE.Mesh
    SIDERS: THREE.Mesh
    TOP_OBJ: THREE.Mesh
  }
  materials: {
    ['MAT -  Drum']: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

type DrumProps = JSX.IntrinsicElements['group'] & {
  scale?: number | [number, number, number]
}

export function Drum({ scale = 1, ...props }: DrumProps) {
  const { nodes, materials } = useGLTF('/models/drum.glb') as GLTFResult
  return (
    <group {...props} dispose={null} scale={scale}>
      <mesh geometry={nodes.BODY.geometry} material={materials['MAT -  Drum']} position={[0, -0.003, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.COVERS.geometry} material={materials['MAT -  Drum']} position={[0, -0.003, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.MID_PATTERN.geometry} material={materials['MAT -  Drum']} position={[0, -0.003, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.SIDERS.geometry} material={materials['MAT -  Drum']} position={[0, -0.003, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.TOP_OBJ.geometry} material={materials['MAT -  Drum']} position={[0, -0.003, 0]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/models/drum.glb')