import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Sphere, Torus } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Plate() {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.35;
  });
  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={ref} castShadow>
          <torusGeometry args={[1.2, 0.35, 64, 128]} />
          <MeshDistortMaterial color="#34d399" roughness={0.15} metalness={0.6} distort={0.25} speed={1.8} />
        </mesh>
        <Sphere args={[0.75, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial color="#f5c46b" roughness={0.2} metalness={0.4} distort={0.35} speed={2.2} />
        </Sphere>
      </Float>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={2}>
        <Torus args={[2.4, 0.02, 16, 128]} rotation={[Math.PI / 2.4, 0, 0]}>
          <meshStandardMaterial color="#34d399" emissive="#0f5b3a" emissiveIntensity={0.6} />
        </Torus>
      </Float>
    </group>
  );
}

export function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="!absolute inset-0 !h-full !w-full"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} color="#a7f3d0" />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#f5c46b" />
        <Plate />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
