import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Sparkles, Float, Instance, Instances, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SceneSettings } from '../types';

// Augment JSX namespace to include Three.js intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      capsuleGeometry: any;
      boxGeometry: any;
      sphereGeometry: any;
      coneGeometry: any;
      pointLight: any;
      ambientLight: any;
      directionalLight: any;
      orthographicCamera: any;
      planeGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

// --- MATERIAL CONSTANTS ---
const COPPER_PATINA_COLOR = new THREE.Color('#2C8C85'); // Classic Liberty Green
const COPPER_FRESH_COLOR = new THREE.Color('#B87333');
const GRANITE_COLOR = new THREE.Color('#8c8c8c');
const WATER_COLOR = new THREE.Color('#1a3c40');

// --- SUB-COMPONENTS ---

// Procedural Statue Mesh
const LadyLiberty = ({ windIntensity }: { windIntensity: number }) => {
  const torchRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (torchRef.current) {
      // Subtle sway of the torch arm based on wind
      torchRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.02 * windIntensity;
      torchRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.01 * windIntensity;
    }
  });

  return (
    <group position={[0, 18, 0]}>
      {/* Base of the statue (Feet/Robe Bottom) */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.5, 4.5, 4, 16]} />
        <meshStandardMaterial 
          color={COPPER_PATINA_COLOR} 
          roughness={0.8} 
          metalness={0.2}
          bumpScale={0.05}
        />
      </mesh>

      {/* Main Body Robe Folds (Abstracted) */}
      <group position={[0, 8, 0]}>
         <mesh castShadow receiveShadow>
            <cylinderGeometry args={[2.8, 3.4, 10, 12]} />
            <meshStandardMaterial color={COPPER_PATINA_COLOR} roughness={0.8} />
         </mesh>
         {/* Procedural Folds using Torus segments */}
         {[...Array(5)].map((_, i) => (
           <mesh key={i} position={[0, -3 + i * 1.5, 0]} rotation={[Math.PI / 12, i, 0]} castShadow>
             <torusGeometry args={[3.2 - (i * 0.1), 0.4, 8, 24, Math.PI * 1.2]} />
             <meshStandardMaterial color={COPPER_PATINA_COLOR} roughness={0.9} />
           </mesh>
         ))}
      </group>

      {/* Upper Body / Chest */}
      <mesh position={[0, 14, 0]} castShadow receiveShadow>
         <cylinderGeometry args={[2.5, 2.8, 4, 12]} />
         <meshStandardMaterial color={COPPER_PATINA_COLOR} />
      </mesh>

      {/* Tablet Arm (Left) */}
      <group position={[-1.8, 14, 1.5]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, -2, 0.5]} rotation={[0.5, 0, 0]} castShadow>
           <capsuleGeometry args={[0.7, 4, 4, 8]} />
           <meshStandardMaterial color={COPPER_PATINA_COLOR} />
        </mesh>
        {/* The Tablet */}
        <mesh position={[0.2, -2.5, 1.5]} rotation={[0.3, 0, -0.2]} castShadow>
           <boxGeometry args={[2.5, 3.5, 0.4]} />
           <meshStandardMaterial color={COPPER_PATINA_COLOR} roughness={0.6} />
        </mesh>
        <Text 
            position={[0.2, -2.5, 1.72]} 
            rotation={[0.3, 0, -0.2]} 
            fontSize={0.4} 
            color="#1f5c57"
            anchorX="center" 
            anchorY="middle"
        >
          MDCCLXXVI
        </Text>
      </group>

      {/* Head & Crown */}
      <group position={[0, 17, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color={COPPER_PATINA_COLOR} />
        </mesh>
        {/* Crown Spikes */}
        {[...Array(7)].map((_, i) => (
           <mesh key={i} position={[0, 1.5, 0]} rotation={[0, 0, (i - 3) * 0.3]}>
             <coneGeometry args={[0.15, 2.5, 8]} />
             <meshStandardMaterial color={COPPER_PATINA_COLOR} />
             <group position={[0, 1.2, 0]} /> {/* Offset for pivot */}
           </mesh>
        ))}
      </group>

      {/* Torch Arm (Right) - Animated Group */}
      <group ref={torchRef} position={[2, 15, 0]} rotation={[0, 0, -0.3]}>
         {/* Arm */}
         <mesh position={[0.5, 3, 0]} rotation={[0, 0, -0.2]} castShadow>
            <cylinderGeometry args={[0.7, 0.8, 8, 8]} />
            <meshStandardMaterial color={COPPER_PATINA_COLOR} />
         </mesh>
         {/* Torch Base */}
         <mesh position={[1.2, 7, 0]} castShadow>
             <cylinderGeometry args={[0.8, 0.4, 1.5, 8]} />
             <meshStandardMaterial color="#b8860b" metalness={0.6} roughness={0.3} />
         </mesh>
         {/* Flame (Emissive) */}
         <mesh position={[1.2, 8.2, 0]}>
             <coneGeometry args={[0.6, 2.5, 8]} />
             <meshStandardMaterial 
               color="#ffaa00" 
               emissive="#ff4400" 
               emissiveIntensity={2} 
               transparent 
               opacity={0.9} 
             />
         </mesh>
         {/* Real Light from Torch */}
         <pointLight position={[1.2, 8.5, 0]} intensity={2} color="#ffaa00" distance={10} decay={2} />
         {/* Flame Particles/Sparkles */}
         <group position={[1.2, 9, 0]}>
             <Sparkles count={20} scale={2} size={4} speed={0.4 + windIntensity} opacity={0.8} color="#ffcc00" />
         </group>
      </group>
    </group>
  );
};

const Pedestal = () => {
  return (
    <group position={[0, 0, 0]}>
       {/* Fort Wood Star Base (Abstracted as layered cylinders/boxes) */}
       <mesh position={[0, 1, 0]} receiveShadow>
          <cylinderGeometry args={[16, 18, 2, 11]} />
          <meshStandardMaterial color={GRANITE_COLOR} roughness={0.9} map={null} />
       </mesh>
       <mesh position={[0, 4, 0]} receiveShadow>
          <cylinderGeometry args={[12, 14, 4, 4]} />
          <meshStandardMaterial color={GRANITE_COLOR} roughness={0.9} />
       </mesh>
       {/* Main Pedestal */}
       <mesh position={[0, 11, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 12, 8]} />
          <meshStandardMaterial color="#a89f91" roughness={0.6} />
       </mesh>
       {/* Detail ridges */}
       <mesh position={[0, 16.5, 0]} castShadow>
          <boxGeometry args={[8.5, 1, 8.5]} />
          <meshStandardMaterial color="#a89f91" />
       </mesh>
    </group>
  );
};

const Water = ({ windIntensity }: { windIntensity: number }) => {
  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (waterRef.current) {
       // Simple uv scrolling or texture manipulation could happen here
       // For now we rely on the environment map reflection
       waterRef.current.rotation.x = -Math.PI / 2;
    }
  });

  return (
    <mesh ref={waterRef} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000, 64, 64]} />
      <meshStandardMaterial 
        color={WATER_COLOR} 
        roughness={0.0} 
        metalness={0.8}
        envMapIntensity={1}
      />
    </mesh>
  );
};

// Instanced Tourists
const Tourists = ({ count = 50 }: { count?: number }) => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 5; // On the star base
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      temp.push({ position: [x, 2, z], scale: 0.5 + Math.random() * 0.2 });
    }
    return temp;
  }, [count]);

  return (
    <Instances range={count}>
      <capsuleGeometry args={[0.3, 0.9, 4, 8]} />
      <meshStandardMaterial color="#333" />
      {particles.map((data, i) => (
        <Instance key={i} position={data.position as [number, number, number]} scale={data.scale} />
      ))}
    </Instances>
  );
};

const SceneContent: React.FC<{ settings: SceneSettings }> = ({ settings }) => {
  const { sunAzimuth, sunElevation, windIntensity, showTourists } = settings;

  // Calculate sun position
  const phi = THREE.MathUtils.degToRad(90 - sunElevation);
  const theta = THREE.MathUtils.degToRad(sunAzimuth);
  const sunPosition = new THREE.Vector3().setFromSphericalCoords(100, phi, theta);

  return (
    <>
      {/* Lighting & Environment */}
      <Sky sunPosition={sunPosition} turbidity={8} rayleigh={6} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <Stars radius={300} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.3} color="#b0c4de" />
      <directionalLight
        position={sunPosition}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
      </directionalLight>

      {/* Objects */}
      <Pedestal />
      <LadyLiberty windIntensity={windIntensity} />
      <Water windIntensity={windIntensity} />
      
      {/* Details */}
      {showTourists && <Tourists count={80} />}
      
      {/* Background Silhouette - Manhattan (Very abstract boxes in distance) */}
      <group position={[-100, 0, -200]}>
         {[...Array(15)].map((_, i) => (
            <mesh key={i} position={[i * 15 - 100, 20 + Math.random() * 30, 0]}>
               <boxGeometry args={[10, 40 + Math.random() * 60, 10]} />
               <meshBasicMaterial color="#1a253a" transparent opacity={0.8} />
            </mesh>
         ))}
      </group>

      {/* Controls */}
      <OrbitControls 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2 - 0.05} 
        maxDistance={150}
        minDistance={10}
        target={[0, 18, 0]} // Target the statue
        enablePan={true}
      />
    </>
  );
};

export const Scene3D: React.FC<{ settings: SceneSettings; onResetRef: React.MutableRefObject<() => void> }> = ({ settings, onResetRef }) => {
  const controlRef = useRef<any>(null);

  // Expose reset function
  onResetRef.current = () => {
    if (controlRef.current) {
      controlRef.current.reset();
    }
  };

  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows camera={{ position: [40, 20, 60], fov: 45 }} dpr={[1, 2]}>
        <SceneContent settings={settings} />
      </Canvas>
    </div>
  );
};