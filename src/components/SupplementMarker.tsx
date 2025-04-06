import { useState } from 'react';
import { Html } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Supplement } from '../types/Supplement';
import { 
  Brain, 
  Heart, 
  Bone, 
  Pill, 
  Activity,
  Dumbbell
} from 'lucide-react';

interface SupplementMarkerProps {
  supplement: Supplement;
  onClick: (supplement: Supplement) => void;
}

export const SupplementMarker = ({ supplement, onClick }: SupplementMarkerProps) => {
  const [hovered, setHovered] = useState(false);

  const getIcon = () => {
    // Determine icon based on target area or supplement type
    const area = supplement.targetArea.toLowerCase();
    if (area.includes('head') || area.includes('brain')) return Brain;
    if (area.includes('heart') || area.includes('chest')) return Heart;
    if (area.includes('joint') || area.includes('bone')) return Bone;
    if (area.includes('muscle')) return Dumbbell;
    if (area.includes('energy')) return Activity;
    return Pill;
  };

  const IconComponent = getIcon();

  return (
    <group
      position={supplement.position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick(supplement);
      }}
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
      {/* 3D Sphere */}
      <mesh>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial 
          color={hovered ? 'tomato' : 'red'} 
          emissive={hovered ? '#00FF55' : '#FFA600'}
          emissiveIntensity={hovered ? 1 : 0}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Tooltip - reduced distance by changing y position from 0.3 to 0.15 */}
      {hovered && (
        <Html position={[0, 0.15, 0]}>
          <div className="bg-[#000814]/80 backdrop-blur-sm border border-[#00ffff]/30 px-3 py-2 rounded text-sm whitespace-nowrap text-[#00ffff] shadow-lg shadow-[#00ffff]/20">
            {supplement.name}
            <div className="text-xs text-[#00ffff]/70">
              {supplement.targetArea}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}; 