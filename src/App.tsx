import { Canvas } from '@react-three/fiber';
import { Box } from './Box';
import { Environment, OrbitControls, RandomizedLight, Sphere, useTexture } from '@react-three/drei';
import { HumanModel } from './HumanModel';
import { DoubleSide } from 'three';

function Vid() {
  // const vid = useVideoTexture("https://video.wixstatic.com/video/8d6639_0d806054eddc4e4d8b9230507c4866ba/1080p/mp4/file.mp4");
  const vid = useTexture("sky.jpg");
  return <Sphere scale={6} rotation={[0,1.7,0]}>
    <meshBasicMaterial map={vid} toneMapped={false} side={DoubleSide} />
  </Sphere>
}

const App = () => {
  return (
    <div className="h-screen w-screen">
      <Canvas camera={{ position: [0, 2,2.5], fov: 50 }}>
        <OrbitControls 
          minDistance={2}
          maxDistance={6}
          target={[0, 1, 0]}
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Environment files={"fluid.jpg"} />
        <HumanModel/>
        <RandomizedLight castShadow amount={8} frames={100} position={[5, 5, -10]} />
        <Vid/>
      </Canvas>
    </div>
  );
};

export default App;
