"use client";

import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import { brandPalette } from "@/lib/theme/palette";

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={1.35}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={brandPalette.heroMeshColor}
          wireframe
          distort={0.25}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

/**
 * Decorative WebGL hero background. Lazy-loaded; skip when reduced-motion.
 * Renders behind content (pointer-events-none, low opacity).
 */
export function Hero3DBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(52vw,520px)] opacity-40 md:block dark:opacity-30"
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 2]} intensity={0.8} />
        <FloatingShape />
      </Canvas>
    </div>
  );
}
