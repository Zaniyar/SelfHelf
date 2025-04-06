import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, RandomizedLight, Sphere, useTexture } from '@react-three/drei';
import { HumanModel } from './HumanModel';
import { DoubleSide } from 'three';
import { useState } from 'react';
import { Login } from './components/Login';
import { Onboarding, UserData } from './components/Onboarding';
import { AddSupplementButton } from './components/AddSupplementButton';
import { SideDrawer } from './components/SideDrawer';
import { OverlayMessage } from './components/OverlayMessage';
import { SupplementMarker } from './components/SupplementMarker';
import { Supplement } from './types/Supplement';
import { v4 as uuidv4 } from 'uuid';
import { ThreeEvent } from '@react-three/fiber';

function Vid() {
  // const vid = useVideoTexture("https://video.wixstatic.com/video/8d6639_0d806054eddc4e4d8b9230507c4866ba/1080p/mp4/file.mp4");
  const vid = useTexture("sky.jpg");
  return <Sphere scale={6} rotation={[0,1.7,0]}>
    <meshBasicMaterial map={vid} toneMapped={false} side={DoubleSide} />
  </Sphere>
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | undefined>();
  const [pendingPosition, setPendingPosition] = useState<[number, number, number] | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleOnboarding = (data: UserData) => {
    setUserData(data);
  };

  const handleAddSupplement = () => {
    setIsAddingMode(true);
    document.body.style.cursor = 'crosshair';
  };

  const handleModelPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (isAddingMode) {
      console.log('Pointer down');
      setDragStartTime(Date.now());
    }
  };


  const handleModelPointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (isAddingMode) {
      console.log('Pointer up');
      const dragDuration = Date.now() - dragStartTime;
      console.log('Drag duration:', dragDuration);
      
      // If the drag duration is less than 200ms, consider it a click
      if (dragDuration < 200) {
        console.log('Adding supplement at position:', event.point.toArray());
        const position = event.point.toArray();
        setPendingPosition(position);
        setIsDrawerOpen(true);
        setIsAddingMode(false);
        document.body.style.cursor = 'auto';
      }
    }
  };

  const handleSupplementClick = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setIsDrawerOpen(true);
  };

  const handleSaveSupplement = (supplementData: Omit<Supplement, 'id' | 'position'>) => {
    if (pendingPosition) {
      const newSupplement: Supplement = {
        ...supplementData,
        id: uuidv4(),
        position: pendingPosition,
      };
      setSupplements([...supplements, newSupplement]);
      setPendingPosition(null);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSupplement(undefined);
    setPendingPosition(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (!userData) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="h-screen w-screen relative">
      <Canvas camera={{ position: [0, 2, 2.5], fov: 50 }}>
        <OrbitControls 
          minDistance={2}
          maxDistance={6}
          target={[0, 1, 0]}
          enabled={true}
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Environment files={"fluid.jpg"} />
        <HumanModel 
          onPointerDown={handleModelPointerDown}
          onPointerUp={handleModelPointerUp}
          gender={userData?.gender || 'other'}
        />
        <RandomizedLight castShadow amount={8} frames={100} position={[5, 5, -10]} />
        <Vid/>
        {supplements.map((supplement) => (
          <SupplementMarker
            key={supplement.id}
            supplement={supplement}
            onClick={handleSupplementClick}
          />
        ))}
      </Canvas>
      <AddSupplementButton onClick={handleAddSupplement} />
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveSupplement}
        supplement={selectedSupplement}
        mode={selectedSupplement ? 'view' : 'add'}
      />
      <OverlayMessage
        isVisible={isAddingMode}
        message="Click on the body model to place your supplement"
      />
    </div>
  );
};

export default App;
