import { useState } from 'react';
import { Html, Sphere } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Supplement } from '../types/Supplement';

interface SupplementMarkerProps {
  supplement: Supplement;
  onClick: (supplement: Supplement) => void;
}

export const SupplementMarker = ({ supplement, onClick }: SupplementMarkerProps) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(supplement);
  };

  return (
    <group
      position={supplement.position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <Sphere args={[0.03]}>
        <meshStandardMaterial
          color={hovered ? '#ff6b6b' : '#ff0000'}
          emissive={hovered ? '#ff6b6b' : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </Sphere>
      {hovered && (
        <Html position={[0, 0.2, 0]}>
          <div className="bg-white px-2 py-1 rounded shadow text-sm whitespace-nowrap">
            {supplement.name}
          </div>
        </Html>
      )}
    </group>
  );
}; 