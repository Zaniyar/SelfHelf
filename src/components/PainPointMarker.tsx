import { Html } from '@react-three/drei';
import { PainPoint } from '../types/PainPoint';
import { format } from 'date-fns';

interface PainPointMarkerProps {
  painPoint: PainPoint;
  onClick: (painPoint: PainPoint) => void;
}

export const PainPointMarker = ({ painPoint, onClick }: PainPointMarkerProps) => {
  return (
    <group position={painPoint.position}>
      <mesh onClick={() => onClick(painPoint)}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#ef4444"
          emissiveIntensity={0.5} 
          transparent
          opacity={0.8}
        />
      </mesh>
      <Html position={[0, 0.15, 0]} center>
        <div className="bg-red-500/90 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
          <div>Pain Level: {painPoint.painLevel}/10</div>
          <div>{format(painPoint.startDate, 'MMM d, yyyy')}</div>
        </div>
      </Html>
    </group>
  );
}; 