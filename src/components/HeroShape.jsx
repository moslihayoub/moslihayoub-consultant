import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Icosahedron interactif ─── */
function IcosahedronMesh({ mouseRef }) {
  const meshRef = useRef();
  const wireRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Smooth lerp toward mouse target
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;

    meshRef.current.rotation.x = currentRotation.current.x + Math.sin(t * 0.3) * 0.08;
    meshRef.current.rotation.y = currentRotation.current.y + t * 0.12;
    meshRef.current.rotation.z = Math.cos(t * 0.2) * 0.04;

    if (wireRef.current) {
      wireRef.current.rotation.x = meshRef.current.rotation.x;
      wireRef.current.rotation.y = meshRef.current.rotation.y;
      wireRef.current.rotation.z = meshRef.current.rotation.z;
    }
  });

  // Update target based on mouse from parent ref
  useFrame(() => {
    if (!mouseRef?.current) return;
    targetRotation.current.x = -mouseRef.current.y * 0.8;
    targetRotation.current.y = mouseRef.current.x * 0.8;
  });

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.8, 0), []);

  return (
    <group>
      {/* Main glass body */}
      <mesh ref={meshRef} geometry={geometry} castShadow>
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          roughness={0.05}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.04}
          color="#8eddd1"
          anisotropy={0.2}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.05}
          attenuationColor="#8eddd1"
          attenuationDistance={1.5}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef} geometry={geometry}>
        <meshBasicMaterial
          color="#8eddd1"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

/* ─── Particules flottantes ─── */
function Particles({ count = 60 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#8eddd1" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Composant principal exporté ─── */
export default function HeroShape({ height = 480 }) {
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      style={{ width: '100%', height: `${height}px`, cursor: 'grab' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8eddd1" />

        <IcosahedronMesh mouseRef={mouseRef} />
        <Particles />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
