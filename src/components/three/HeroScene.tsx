"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/providers/ThemeProvider";
import { THEME_GL } from "@/lib/themes";

interface Colors {
  a: string;
  b: string;
  c: string;
}

function Blob({ colors }: { colors: Colors }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const g = group.current;
    if (g) {
      // Parallax toward pointer + gentle idle drift.
      target.current.x = state.pointer.y * 0.32;
      target.current.y = state.pointer.x * 0.5;
      g.rotation.x += (target.current.x - g.rotation.x) * 0.05;
      g.rotation.y += (target.current.y - g.rotation.y) * 0.05 + 0.0015;
    }
    if (inner.current) {
      inner.current.rotation.y -= dt * 0.3;
      inner.current.rotation.x += dt * 0.14;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.0}>
        {/* Glass shell — translucent tinted */}
        <Icosahedron args={[1.46, 18]}>
          <MeshDistortMaterial
            color={colors.a}
            distort={0.32}
            speed={1.4}
            roughness={0.04}
            metalness={0.12}
            transparent
            opacity={0.55}
            envMapIntensity={1}
          />
        </Icosahedron>

        {/* Glowing iridescent core — shifts the second hue */}
        <Icosahedron ref={inner} args={[0.96, 10]}>
          <MeshDistortMaterial
            color={colors.b}
            distort={0.52}
            speed={2.2}
            roughness={0.18}
            metalness={0.35}
            emissive={new THREE.Color(colors.b)}
            emissiveIntensity={0.35}
            transparent
            opacity={0.9}
          />
        </Icosahedron>

        {/* Wire halo — third hue */}
        <Icosahedron args={[1.86, 3]}>
          <meshBasicMaterial color={colors.c} wireframe transparent opacity={0.14} />
        </Icosahedron>
      </Float>

      <Sparkles count={72} scale={[7.5, 5.5, 5]} size={3} speed={0.4} color={colors.c} opacity={0.8} />
    </group>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const colors = useMemo<Colors>(() => {
    const t = THEME_GL[theme];
    return { a: t.a, b: t.b, c: t.c };
  }, [theme]);

  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 6]} intensity={2.4} />
      <pointLight position={[-5, -2, 3]} intensity={50} color={colors.c} distance={22} />
      <pointLight position={[5, 3, -2]} intensity={40} color={colors.b} distance={22} />
      <Blob colors={colors} />
    </Canvas>
  );
}
