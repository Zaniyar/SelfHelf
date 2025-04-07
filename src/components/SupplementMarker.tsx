import { Html } from '@react-three/drei';
import { Supplement } from '../types/Supplement';

interface SupplementMarkerProps {
  supplement: Supplement;
  onClick: (supplement: Supplement) => void;
}

export const SupplementMarker = ({ supplement, onClick }: SupplementMarkerProps) => {
  return (
    <group position={supplement.position}>
      <mesh onClick={() => onClick(supplement)}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6"
          emissiveIntensity={0.5} 
          transparent
          opacity={0.8}
        />
      </mesh>
      <Html position={[0, 0.15, 0]} center>
        <div className="bg-blue-500/90 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
          <div>{supplement.name}</div>
          <div className="text-xs opacity-75">{supplement.targetArea}</div>
        </div>
      </Html>
    </group>
  );
}; 