"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** 24K Altın Tonik bölümü için yavaşça süzülen altın tanecikleri. */
export default function GoldFlakes({ count = 90, radius = 3.2 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        a: Math.random() * Math.PI * 2,
        r: 0.6 + Math.random() * radius,
        y: -2 + Math.random() * 6,
        s: 0.012 + Math.random() * 0.03,
        v: 0.08 + Math.random() * 0.22,
        spin: Math.random() * Math.PI,
      })),
    [count, radius]
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const y = ((s.y - t * s.v + 4) % 8) - 3;
      dummy.position.set(Math.cos(s.a + t * 0.05) * s.r, y, Math.sin(s.a + t * 0.05) * s.r);
      dummy.rotation.set(t * 0.4 + s.spin, t * 0.6 + s.spin, 0);
      dummy.scale.setScalar(s.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1.6]} />
      <meshStandardMaterial
        color="#e8c67f"
        metalness={1}
        roughness={0.22}
        side={THREE.DoubleSide}
        emissive="#6b4c15"
        emissiveIntensity={0.25}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}
