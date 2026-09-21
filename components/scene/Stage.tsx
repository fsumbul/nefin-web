"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import Bottle from "./Bottle";
import GoldFlakes from "./GoldFlakes";

/** WebGL var mı? Yoksa sahne hiç yüklenmez, poster görsel kalır. */
export function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Zayıf cihaz sezgisi — pahalı cam malzemesini ve tanecikleri kısar. */
function isLite() {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return mem <= 4 || cores <= 4 || (coarse && window.innerWidth < 900);
}

/** Scroll ile kamerayı şişeye doğru yaklaştırır ve hafifçe yükseltir. */
function CameraRig({ progress }: { progress: React.RefObject<number> }) {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const p = progress.current ?? 0;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 8.6 - p * 2.6, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.2 + p * 0.85, 3, delta);
    camera.lookAt(0, 0.1 + p * 0.5, 0);
  });
  return null;
}

type Props = {
  progress: React.RefObject<number>;
  flakes?: boolean;
  className?: string;
  onReady?: () => void;
};

export default function Stage({ progress, flakes = false, className, onReady }: Props) {
  const [lite, setLite] = useState(true);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => setLite(isLite()), []);

  // Ekrandan çıkınca render döngüsünü durdur (pil ve ısı).
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className={className}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={lite ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          onReady?.();
        }}
        shadows={!lite}
      >
        <PerspectiveCamera makeDefault fov={32} position={[0, 0.2, 8.6]} />
        <CameraRig progress={progress} />
        <color attach="background" args={["#f6efe4"]} />

        {/* Yumuşak pencere ışığı — marka brief'i: sert stüdyo flaşı yok. */}
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3.2, 6, 4]}
          intensity={1.5}
          castShadow={!lite}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0006}
        />
        <directionalLight position={[-4, 2.5, -2]} intensity={0.45} color="#ffd9a8" />

        <Environment resolution={lite ? 128 : 256}>
          <Lightformer form="rect" intensity={3.2} position={[-3, 4, 3]} scale={[7, 7, 1]} color="#fff6e8" />
          <Lightformer form="rect" intensity={1.4} position={[4, 2, 2]} scale={[5, 5, 1]} color="#f7e2c4" />
          <Lightformer form="circle" intensity={1.1} position={[0, -3, 2]} scale={[6, 6, 1]} color="#eadbc8" />
        </Environment>

        <Suspense fallback={null}>
          <group position={[0, -1.35, 0]} scale={0.62}>
            <Bottle progress={progress} lite={lite} />
            {flakes && !lite && <GoldFlakes count={70} />}
          </group>
          {!lite && (
            <ContactShadows position={[0, -1.37, 0]} opacity={0.28} scale={8} blur={2.6} far={4} color="#6b564b" />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
