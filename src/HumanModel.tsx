import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    mesh: THREE.SkinnedMesh
    haircut_generated: THREE.SkinnedMesh
    outfit_meta_5_lowpoly: THREE.SkinnedMesh
    RootNode: THREE.Bone
  }
  materials: {}
}

export function HumanModel(props: JSX.IntrinsicElements['group']) {
  const { nodes, scene, materials } = useGLTF('/zaniyar.glb') as GLTFResult


    // Traverse over all objects in the scene
    scene.traverse((object) => {
        // Check if the object is a mesh
        if (object instanceof THREE.Mesh) {
            // Get the material of the mesh
            let material = object.material;
            // Add metalness and roughness to the material
            if (material) {
                // material.transparent = true;
                // material.opacity = 0.3;
            
                console.log("m", material)
                material.map = null;
                // material.envMap = texture;
                material.metalness = 1.0; // Set metalness to 1 for pure metal
                material.roughness = 0.1; // Adjust this value to change the level of roughness
            }
        }
    });

  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.RootNode} />
      <skinnedMesh
        geometry={nodes.haircut_generated.geometry}
        material={nodes.haircut_generated.material}
        skeleton={nodes.haircut_generated.skeleton}
      />
{/*       <skinnedMesh
        geometry={nodes.outfit_meta_5_lowpoly.geometry}
        material={nodes.outfit_meta_5_lowpoly.material}
        skeleton={nodes.outfit_meta_5_lowpoly.skeleton}
      /> */}
    </group>
  )
}

useGLTF.preload('/zaniyar.glb')