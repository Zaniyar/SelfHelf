import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, RandomizedLight, Sphere, useTexture } from '@react-three/drei';
import { HumanModel } from './HumanModel';
import { DoubleSide } from 'three';
import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Onboarding, UserData } from './components/Onboarding';
import { AddSupplementButton } from './components/AddSupplementButton';
import { SideDrawer } from './components/SideDrawer';
import { OverlayMessage } from './components/OverlayMessage';
import { SupplementMarker } from './components/SupplementMarker';
import { Supplement } from './types/Supplement';
import { v4 as uuidv4 } from 'uuid';
import { ThreeEvent } from '@react-three/fiber';
import { SettingsDrawer } from './components/Settings';
import { FloatingButtons } from './components/FloatingButtons';
import { PainPointDrawer } from './components/PainPointDrawer';
import { PainPoint } from './types/PainPoint';
import { PainPointMarker } from './components/PainPointMarker';
import { FilterBox } from './components/FilterBox';

// Move Vid outside of App and add props
interface VidProps {
  bgColor: string;
}

function Vid({ bgColor }: VidProps) {
  const vid = useTexture("sky.jpg");
  return <Sphere scale={6} rotation={[0,1.7,0]}>
    <meshBasicMaterial map={vid} color={bgColor} toneMapped={false} side={DoubleSide} />
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
  const [selectedBone, setSelectedBone] = useState<string | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'dark'
  );
  const [bgColor, setBgColor] = useState(() => 
    localStorage.getItem('bgColor') || '#222222'
  );
  const [environment, setEnvironment] = useState(() => 
    localStorage.getItem('environment') || 'zebra.jpg'
  );
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [isPainDrawerOpen, setIsPainDrawerOpen] = useState(false);
  const [isAddingPainPoint, setIsAddingPainPoint] = useState(false);
  const [showSupplements, setShowSupplements] = useState(true);
  const [showPainPoints, setShowPainPoints] = useState(true);

  // Update theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
    
    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // Optionally save to localStorage
    localStorage.setItem('theme', newTheme);
  };

  const handleUpdateUserData = (newData: UserData) => {
    setUserData(newData);
    // Optionally save to localStorage or your backend
    localStorage.setItem('userData', JSON.stringify(newData));
  };

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
    if (isAddingMode || isAddingPainPoint) {
      console.log('Pointer down');
      setDragStartTime(Date.now());
    }
  };

  const handleModelPointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (isAddingMode || isAddingPainPoint) {
      console.log('Pointer up');
      const dragDuration = Date.now() - dragStartTime;
      console.log('Drag duration:', dragDuration);
      
      // If the drag duration is less than 200ms, consider it a click
      if (dragDuration < 200) {
        console.log('Adding point at position:', event.point.toArray());
        const position = event.point.toArray();
        setPendingPosition(position);
        
        if (isAddingMode) {
          setIsDrawerOpen(true);
          setIsAddingMode(false);
        } else {
          setIsPainDrawerOpen(true);
          setIsAddingPainPoint(false);
        }
        document.body.style.cursor = 'auto';
      }
    }
  };

  const handleModelClick = (event: ThreeEvent<PointerEvent>, boneName?: string) => {
    if (isAddingMode || isAddingPainPoint) {
      const position = event.point.toArray();
      setPendingPosition(position);
      setSelectedBone(boneName);
      
      if (isAddingMode) {
        setIsDrawerOpen(true);
        setIsAddingMode(false);
      } else {
        setIsPainDrawerOpen(true);
        setIsAddingPainPoint(false);
      }
      document.body.style.cursor = 'auto';
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

  const handleBgColorChange = (newColor: string) => {
    setBgColor(newColor);
    localStorage.setItem('bgColor', newColor);
  };

  const handleEnvironmentChange = (newEnv: string) => {
    setEnvironment(newEnv);
    localStorage.setItem('environment', newEnv);
  };

  const handleAddPainPoint = () => {
    setIsAddingPainPoint(true);
    document.body.style.cursor = 'crosshair';
  };

  const handleSavePainPoint = (painPointData: Omit<PainPoint, 'id' | 'position'>) => {
    if (pendingPosition) {
      const newPainPoint: PainPoint = {
        ...painPointData,
        id: uuidv4(),
        position: pendingPosition,
      };
      setPainPoints([...painPoints, newPainPoint]);
      setPendingPosition(null);
    }
  };

  // Add this effect after your other useEffect hooks
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (isAddingMode || isAddingPainPoint)) {
        setIsAddingMode(false);
        setIsAddingPainPoint(false);
        document.body.style.cursor = 'auto';
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleEscape);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isAddingMode, isAddingPainPoint]); // Only re-run if isAddingMode changes

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (!userData) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="canvas-container h-screen w-screen relative">
      <h1 className="title text-4xl font-bold text-center text-white borel-regular">SelfHelf</h1>
      <h2 className="subtitle">feel good</h2>
      
      <FilterBox 
        showSupplements={showSupplements}
        showPainPoints={showPainPoints}
        onToggleSupplements={() => setShowSupplements(!showSupplements)}
        onTogglePainPoints={() => setShowPainPoints(!showPainPoints)}
      />

      <Canvas camera={{ position: [0, 2, 2.5], fov: 50 }}>
        <OrbitControls 
          minDistance={1}
          maxDistance={4}
          target={[0, 1, 0]}
          enabled={true}
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Environment files={environment} />
        <HumanModel 
          onPointerDown={handleModelPointerDown}
          onPointerUp={handleModelPointerUp}
          gender={userData?.gender || 'other'}
          onClick={handleModelClick}
        />
        <RandomizedLight castShadow amount={8} frames={100} position={[5, 5, -10]} />
        <Vid bgColor={bgColor} />
        {showSupplements && supplements.map((supplement) => (
          <SupplementMarker
            key={supplement.id}
            supplement={supplement}
            onClick={handleSupplementClick}
          />
        ))}
        {showPainPoints && painPoints.map((painPoint) => (
          <PainPointMarker
            key={painPoint.id}
            painPoint={painPoint}
            onClick={(painPoint) => {
              console.log('Pain point clicked:', painPoint);
            }}
          />
        ))}
      </Canvas>
      <FloatingButtons 
        onAddSupplementClick={handleAddSupplement}
        onAddPainPointClick={handleAddPainPoint}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveSupplement}
        supplement={selectedSupplement}
        mode={selectedSupplement ? 'view' : 'add'}
        selectedBone={selectedBone}
      />
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userData={userData}
        onUpdateUserData={handleUpdateUserData}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        bgColor={bgColor}
        onBgColorChange={handleBgColorChange}
        currentEnv={environment}
        onEnvChange={handleEnvironmentChange}
      />
      <PainPointDrawer
        isOpen={isPainDrawerOpen}
        onClose={() => {
          setIsPainDrawerOpen(false);
          setPendingPosition(null);
        }}
        onSave={handleSavePainPoint}
        selectedBone={selectedBone}
      />
      <OverlayMessage
        isVisible={isAddingMode || isAddingPainPoint}
        message={`Click on the body model to place your ${isAddingMode ? 'supplement' : 'pain point'}`}
      />
    </div>
  );
};

export default App;
