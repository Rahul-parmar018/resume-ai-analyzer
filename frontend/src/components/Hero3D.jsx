import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Premium Glass Orb with Purple Core (Voxr.ai Aesthetic)
 */
function GlassOrb() {
  const orbRef = useRef();
  const coreRef = useRef();

  useFrame(({ mouse, clock }) => {
    if (!orbRef.current) return;
    // Smooth mouse-following rotation
    orbRef.current.rotation.y = THREE.MathUtils.lerp(orbRef.current.rotation.y, mouse.x * 0.6, 0.05);
    orbRef.current.rotation.x = THREE.MathUtils.lerp(orbRef.current.rotation.x, -mouse.y * 0.3, 0.05);
    
    // Gentle float
    orbRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.15;
    
    // Inner core pulse
    if (coreRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 0.4;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={orbRef}>
      {/* Outer glass shell */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          roughness={0.05}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={1.5}
          thickness={0.5}
          envMapIntensity={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Inner glowing core */}
      <mesh ref={coreRef} scale={0.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#A855F7"
          emissiveIntensity={8}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#A855F7"
          emissiveIntensity={3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

/**
 * Floating particles — purple-tinted star field
 */
function Particles() {
  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000 * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial 
        transparent 
        size={0.015} 
        sizeAttenuation 
        depthWrite={false} 
        color="#c084fc" 
        opacity={0.35}
      />
    </Points>
  );
}

/**
 * Floating glass badge pills (like Voxr's feature chips)
 */
function FloatingChip({ position, text }) {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.8 + position[0]) * 0.15;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[2, 0.5, 0.08]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.8}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full relative">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#A855F7" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#7c3aed" />
        <pointLight position={[0, 5, 5]} intensity={0.3} color="#ffffff" />

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <GlassOrb />
        </Float>
        
        <FloatingChip position={[2.5, 1.2, -1]} />
        <FloatingChip position={[2, -0.5, -0.5]} />
        <FloatingChip position={[1.5, -1.5, -1.5]} />
        
        <Particles />
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
