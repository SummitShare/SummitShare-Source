/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/headrest.glb -t -r public 
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    head_rest: THREE.Mesh
    tart: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
    wire_204204204: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export function Headrest(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/headrest.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.head_rest.geometry} material={materials.Material} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.tart.geometry} material={materials.wire_204204204} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/models/headrest.glb')