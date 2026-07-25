import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Rotation + souris partagés ─── */
function useMouseRotation(mouseRef) {
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  const update = (t) => {
    if (mouseRef?.current) {
      targetRotation.current.x = -mouseRef.current.y * 0.8;
      targetRotation.current.y = mouseRef.current.x * 0.8;
    }
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;
    return {
      x: currentRotation.current.x + Math.sin(t * 0.3) * 0.06,
      y: currentRotation.current.y + t * 0.1,
      z: Math.cos(t * 0.2) * 0.03,
    };
  };

  return update;
}

/* ─── Matériau cristal/verre réutilisable ─── */
function GlassMaterial({ color }) {
  return (
    <MeshTransmissionMaterial
      backside
      samples={8}
      thickness={0.6}
      roughness={0.03}
      transmission={0.96}
      ior={1.55}
      chromaticAberration={0.06}
      color={color}
      anisotropy={0.3}
      distortion={0.15}
      distortionScale={0.2}
      temporalDistortion={0.04}
      attenuationColor={color}
      attenuationDistance={2}
    />
  );
}

/* ─── Icosaèdre (Work) — radius 4.84 = 6.916 × 0.70 ─── */
function IcosahedronMesh({ mouseRef, color }) {
  const meshRef = useRef();
  const wireRef = useRef();
  const getRotation = useMouseRotation(mouseRef);

  useFrame((state) => {
    if (!meshRef.current) return;
    const r = getRotation(state.clock.getElapsedTime());
    meshRef.current.rotation.set(r.x, r.y, r.z);
    if (wireRef.current) wireRef.current.rotation.set(r.x, r.y, r.z);
  });

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(4.84, 0), []);

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <GlassMaterial color={color} />
      </mesh>
      <mesh ref={wireRef} geometry={geometry}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ─── Torus Knot (About) — params exact docs Three.js + matériau nacré ─── */
function TorusKnotMesh({ mouseRef }) {
  const meshRef = useRef();
  const wireRef = useRef();
  const getRotation = useMouseRotation(mouseRef);

  useFrame((state) => {
    if (!meshRef.current) return;
    const r = getRotation(state.clock.getElapsedTime());
    meshRef.current.rotation.set(r.x, r.y, r.z);
    if (wireRef.current) wireRef.current.rotation.set(r.x, r.y, r.z);
  });

  // Paramètres exacts du geometry browser Three.js
  const geometry = useMemo(() => new THREE.TorusKnotGeometry(
    6.916,  // radius
    2.574,  // tube
    3,      // tubularSegments
    4,      // radialSegments
    5,      // p
    12      // q
  ), []);

  return (
    <group>
      {/* Matériau nacré/irisé — inspiré de l'ormeau (abalone shell) */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#d0f0e8"
          roughness={0.05}
          metalness={0.15}
          iridescence={1.0}
          iridescenceIOR={1.9}
          iridescenceThicknessRange={[150, 900]}
          transmission={0.15}
          thickness={1.5}
          ior={1.45}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wireRef} geometry={geometry}>
        <meshBasicMaterial color="#a8e8d8" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/* ─── Particules ─── */
function Particles({ count = 80, color }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 38;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 38;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={color} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ─── Composant principal ─── */
// variant: 'icosahedron' (Work) | 'torusknot' (About)
// color: hex string
export default function HeroShape({ height = 480, variant = 'icosahedron', color = '#8eddd1' }) {
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  return (
    <div
      style={{ width: '100%', height: `${height}px`, cursor: 'grab' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseRef.current = { x: 0, y: 0 }; }}
    >
      <Canvas
        camera={{ position: [0, 0, variant === 'torusknot' ? 24 : 18], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[8, 8, 8]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-6, -4, -6]} intensity={0.4} color={color} />
        <pointLight position={[0, 8, 4]} intensity={0.6} color="#ffffff" />

        {variant === 'icosahedron'
          ? <IcosahedronMesh mouseRef={mouseRef} color={color} />
          : <TorusKnotMesh mouseRef={mouseRef} />
        }

        <Particles color={color} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
