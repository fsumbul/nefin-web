"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Nefin 30 ml amber damlalıklı şişesi — prosedürel model.
 * Oranlar ürün fotoğraflarından alındı (03-Assets/images/nefin-beauty/).
 * Çok açılı stüdyo fotoğrafları geldiğinde bu geometri Blender'da modellenen
 * glTF ile değiştirilecek; sahnedeki arayüz (props) aynı kalır.
 */

const AMBER = "#a55c18";
const SERUM = "#d98b2b";
const GOLD = "#c9a45e";

/** Şişe gövdesinin dönme profili: [yarıçap, yükseklik] */
function bodyProfile() {
  const p: THREE.Vector2[] = [];
  const add = (x: number, y: number) => p.push(new THREE.Vector2(x, y));
  add(0, 0);
  add(0.72, 0);
  add(0.78, 0.06);
  add(0.8, 0.16);
  add(0.8, 1.92);
  // omuz
  add(0.79, 2.02);
  add(0.72, 2.2);
  add(0.56, 2.36);
  add(0.46, 2.46);
  // boyun
  add(0.44, 2.52);
  add(0.44, 2.86);
  return p;
}

function liquidProfile(fill = 0.78) {
  const p: THREE.Vector2[] = [];
  const top = 0.12 + 1.8 * fill;
  p.push(new THREE.Vector2(0, 0.08));
  p.push(new THREE.Vector2(0.7, 0.1));
  p.push(new THREE.Vector2(0.73, 0.2));
  p.push(new THREE.Vector2(0.73, top));
  p.push(new THREE.Vector2(0, top));
  return p;
}

type Props = {
  /** 0–1: sahnedeki ilerleme; hafif salınım ve dönüş buna bağlanır */
  progress?: React.RefObject<number>;
  /** düşük güçlü cihazlarda pahalı cam malzemesi kapatılır */
  lite?: boolean;
  fill?: number;
};

export default function Bottle({ progress, lite = false, fill = 0.78 }: Props) {
  const group = useRef<THREE.Group>(null);
  const glass = useMemo(() => new THREE.LatheGeometry(bodyProfile(), 96), []);
  const liquid = useMemo(() => new THREE.LatheGeometry(liquidProfile(fill), 96), [fill]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = progress?.current ?? 0;
    // scroll ile dönüş + çok hafif nefes alma hareketi
    const targetY = p * Math.PI * 1.6 + t * 0.08;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, Math.sin(t * 0.35) * 0.025 - p * 0.12, 3, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, Math.sin(t * 0.5) * 0.035, 3, delta);
  });

  return (
    <group ref={group} dispose={null}>
      {/* serum */}
      <mesh geometry={liquid} castShadow>
        <meshPhysicalMaterial
          color={SERUM}
          transmission={lite ? 0 : 0.55}
          thickness={1.6}
          roughness={0.22}
          ior={1.38}
          attenuationColor={SERUM}
          attenuationDistance={1.4}
          opacity={lite ? 0.92 : 1}
          transparent={lite}
        />
      </mesh>

      {/* amber cam gövde */}
      <mesh geometry={glass} castShadow>
        {lite ? (
          <meshPhysicalMaterial
            color={AMBER}
            roughness={0.12}
            metalness={0}
            transparent
            opacity={0.72}
            clearcoat={1}
            clearcoatRoughness={0.06}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={6}
            resolution={512}
            thickness={0.7}
            roughness={0.05}
            ior={1.5}
            chromaticAberration={0.045}
            anisotropy={0.2}
            distortion={0.05}
            distortionScale={0.18}
            temporalDistortion={0.02}
            attenuationColor={AMBER}
            attenuationDistance={1.15}
            color="#dda05a"
          />
        )}
      </mesh>

      {/* fırçalanmış altın bilezik */}
      <mesh position={[0, 3.02, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.34, 64]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.28} envMapIntensity={1.4} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <torusGeometry args={[0.5, 0.018, 12, 64]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
      </mesh>

      {/* damlalık başlığı */}
      <mesh position={[0, 3.55, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.36, 0.38, 48]} />
        <meshStandardMaterial color="#f4ece1" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, 3.92, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 24]} />
        <meshStandardMaterial color="#f7f1e8" roughness={0.6} />
      </mesh>

      {/* etiket bandı — gerçek etiket dokusu müşteri dosyalarından gelince buraya map edilecek */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.812, 0.812, 0.82, 96, 1, true]} />
        <meshStandardMaterial
          color="#f4ecdd"
          roughness={0.72}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
          opacity={0.96}
        />
      </mesh>
    </group>
  );
}
