import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { ThreeEvent } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    mesh: THREE.SkinnedMesh
    haircut_generated: THREE.SkinnedMesh
    outfit_meta_5_lowpoly: THREE.SkinnedMesh
    RootNode: THREE.Bone
  }
  materials: {}
}

interface HumanModelProps {
  onPointerDown?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerUp?: (event: ThreeEvent<PointerEvent>) => void;
  gender: 'male' | 'female' | 'other';
}
const bonePositions: { name: string; position: THREE.Vector3 }[] = [];

export function HumanModel({ onPointerDown, onPointerUp, gender }: HumanModelProps) {
  // Choose model based on gender
  const modelPath = gender === 'female' ? '/woman.glb' : '/man.glb';
  const { nodes, scene, materials } = useGLTF(modelPath) as GLTFResult


    // Traverse over all objects in the scene
    scene.traverse((object) => {
     // console.log("object", object.name)

      if (object instanceof THREE.Bone) {
        const pos = new THREE.Vector3();
        object.getWorldPosition(pos);
        bonePositions.push({ name: object.name, position: pos });
      }
        // Check if the object is a mesh
        if (object instanceof THREE.Mesh) {
            // Get the material of the mesh
            let material = object.material;
            // Add metalness and roughness to the material
            if (material) {
                // material.transparent = true;
                // material.opacity = 0.3;
            
                // console.log("m", material)
                material.map = null;
                // material.envMap = texture;
                material.metalness = 1.0; // Set metalness to 1 for pure metal
                material.roughness = 0.1; // Adjust this value to change the level of roughness
            }
        }
    });

    const closeBodyPart = (event: ThreeEvent<PointerEvent>) => {
      const clickedPoint = event.point;
      let closestBone = null;
      let minDistance = Infinity;
      
      for (const bone of bonePositions) {
        const distance = bone.position.distanceTo(clickedPoint);
        if (distance < minDistance) {
          minDistance = distance;
          closestBone = bone;
        }
      }
      
      if (closestBone) {
        console.log(`Clicked near bone: ${closestBone.name}`);
      }
    }

  return (
    <group 
      onPointerDown={onPointerDown}
      onPointerUp={(event)=>{
        onPointerUp(event)
        closeBodyPart(event)
      }}
      dispose={null}
    >
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

// Preload both models
useGLTF.preload('/woman.glb');
useGLTF.preload('/man.glb');