import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useEffect, useState } from "react";
import GradientBackground from "../components/GradientBackground.jsx";
import MapOverlay from "../components/MapOverlay.jsx";
import PanelSliderReel from "../components/PanelSliderReel.jsx";
import SceneControls from "../components/SceneControls.jsx";
import { useBackgroundConfig } from "../hooks/useBackgroundConfig.js";
import { useControlPanels } from "../hooks/useControlPanels.jsx";

export default function SliderScene({ chartData, onBackToDashboard }) {
  const [backgroundConfig, setBackgroundConfig] = useBackgroundConfig();
  const [activePanelKey, setActivePanelKey] = useState("tempHum");
  const panels = useControlPanels({
    chartData,
    mode: "slider",
    activePanelKey,
    interactionsEnabled: true,
    onRequestMapOpen: () => window.dispatchEvent(new Event("open-map")),
  });

  useEffect(() => {
    window.dispatchEvent(new Event("close-map"));
  }, [activePanelKey]);

  const showGradientBackground = backgroundConfig.type === "gradient";
  const activeHdriFile = backgroundConfig.hdriFile;

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0.08, 6.7], fov: 38 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {showGradientBackground ? (
          <>
            <Environment key={`lighting-${activeHdriFile}`} files={activeHdriFile} />
            <GradientBackground
              colors={backgroundConfig.gradientColors}
              motion={backgroundConfig.motion}
            />
          </>
        ) : (
          <Environment key={`background-${activeHdriFile}`} files={activeHdriFile} background />
        )}

        <directionalLight
          position={[4, 5, 6]}
          intensity={1.05}
          castShadow
          shadowBias={-0.0005}
        />
        <ambientLight intensity={0.48} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]} receiveShadow>
          <planeGeometry args={[70, 70]} />
          <meshStandardMaterial color="#1a120d" roughness={0.94} metalness={0.08} />
        </mesh>

        <PanelSliderReel
          panels={panels}
          onActivePanelChange={setActivePanelKey}
          onRequestMapOpen={() => window.dispatchEvent(new Event("open-map"))}
        />
      </Canvas>

      <SceneControls
        backgroundConfig={backgroundConfig}
        setBackgroundConfig={setBackgroundConfig}
        actions={[
          {
            label: "Back to Dashboard",
            onClick: onBackToDashboard,
          },
        ]}
      />

      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 24,
          transform: "translateX(-50%)",
          zIndex: 10000,
          padding: "10px 18px",
          borderRadius: "999px",
          background: "rgba(8, 10, 14, 0.46)",
          color: "#eef2f7",
          fontFamily: "sans-serif",
          fontSize: "11px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
          textAlign: "center",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        {panels.find((panel) => panel.key === activePanelKey)?.sliderLabel ?? "Panel Slider"}
        <div
          style={{
            marginTop: 4,
            fontSize: 10,
            letterSpacing: "0.06em",
            opacity: 0.7,
            textTransform: "none",
          }}
        >
          Drag, scroll, or use arrow keys
        </div>
      </div>

      <MapOverlay />
    </>
  );
}
