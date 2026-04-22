import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import GradientBackground from "../components/GradientBackground.jsx";
import Panel3D from "../components/Panel3D.jsx";
import { useBackgroundConfig } from "../hooks/useBackgroundConfig.js";
import { useControlPanels } from "../hooks/useControlPanels.jsx";

function PreviewCameraRig() {
  const angleRef = useRef(0);

  useFrame(({ camera }, delta) => {
    angleRef.current += delta * 0.18;
    const radius = 4.2;
    const x = Math.sin(angleRef.current) * 0.18;
    const y = 1.16 + Math.sin(angleRef.current * 0.45) * 0.06;
    const z = radius + Math.cos(angleRef.current * 0.7) * 0.14;

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.035);
    camera.lookAt(0, 0.15, 0);
  });

  return null;
}

function PreviewPanels({ chartData }) {
  const panels = useControlPanels({
    chartData,
    mode: "dashboard",
    activePanelKey: null,
    interactionsEnabled: false,
  });

  return (
    <group position={[0, 0.05, 0]}>
      {panels.map((panel) => (
        <group key={panel.key} position={panel.defaultPosition}>
          <Panel3D title={panel.title} presentation="dashboard" contentVisible>
            {panel.content}
          </Panel3D>
        </group>
      ))}
    </group>
  );
}

export default function HomePreviewScene({ chartData }) {
  const [backgroundConfig] = useBackgroundConfig();
  const showGradientBackground = backgroundConfig.type === "gradient";
  const activeHdriFile = backgroundConfig.hdriFile;
  const previewChartData = useMemo(
    () =>
      chartData ?? {
        data: [],
        humidity: 0,
        temperature: 0,
        voltage: 0,
      },
    [chartData]
  );

  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.2, 4.2], fov: 52 }}
      style={{ width: "100%", height: "100%" }}
    >
      <PreviewCameraRig />

      {showGradientBackground ? (
        <>
          <Environment key={`home-lighting-${activeHdriFile}`} files={activeHdriFile} />
          <GradientBackground
            colors={backgroundConfig.gradientColors}
            motion={backgroundConfig.motion}
          />
        </>
      ) : (
        <Environment key={`home-background-${activeHdriFile}`} files={activeHdriFile} background />
      )}

      <directionalLight
        position={[5, 6, 5]}
        intensity={0.95}
        castShadow
        shadowBias={-0.0005}
      />
      <ambientLight intensity={0.48} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a120d" roughness={0.94} metalness={0.08} />
      </mesh>

      <PreviewPanels chartData={previewChartData} />
    </Canvas>
  );
}
