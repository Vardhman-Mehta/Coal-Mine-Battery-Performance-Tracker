import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR, VRButton } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

import ControlRoom from "./ControlRoom";

/* ---------------- CAMERA RIG (SIMPLE & STABLE) ---------------- */
function CameraRig({ activePanelRef }) {
  const { camera } = useThree();

  useFrame(() => {
    // ✅ If no active panel → DO NOTHING
    if (!activePanelRef.current) return;

    const p = activePanelRef.current.position;

    // Desired camera position near panel
    const targetX = p.x;
    const targetY = p.y + 0.6;
    const targetZ = 2.8;

    // Smooth move
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
  });

  return null;
}

/* ---------------- SCENE ---------------- */
export default function XRScene() {
  const activePanelRef = useRef(null);

  return (
    <>
      <VRButton />

      <Canvas
        shadows
        camera={{ position: [0, 1.2, 4], fov: 55 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* Controls */}
        <OrbitControls
          enableRotate
          enablePan={false}
          enableZoom
        />

        {/* Background */}
        <color attach="background" args={["#0f0f0f"]} />

        {/* Lighting */}
        <directionalLight
          position={[5, 6, 5]}
          intensity={1}
          castShadow
          shadowBias={-0.0005}
        />
        <ambientLight intensity={0.5} />

        {/* Floor (reference only) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Debug helper */}
        <axesHelper args={[3]} />

        {/* XR + Dashboard */}
        <XR>
          <CameraRig activePanelRef={activePanelRef} />
          <ControlRoom activePanelRef={activePanelRef} />
        </XR>
      </Canvas>
    </>
  );
}
