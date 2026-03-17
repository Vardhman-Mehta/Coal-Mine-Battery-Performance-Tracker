import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR, VRButton, useXR } from "@react-three/xr";
import { OrbitControls, Environment } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import MapOverlay from "../components/MapOverlay.jsx";

import ControlRoom from "./ControlRoom";
import SceneControls from "../components/SceneControls";

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 1.2, 4);
const DEFAULT_CAMERA_TARGET = new THREE.Vector3(0, 0, 0);

function XRSessionBridge({ onPresentingChange }) {
  const isPresenting = useXR((state) => state.isPresenting);

  useEffect(() => {
    onPresentingChange(isPresenting);
  }, [isPresenting, onPresentingChange]);

  return null;
}

function CameraRig({
  activePanelRef,
  cameraMode,
  controlsRef,
  experienceEyeRef,
  experienceLookTargetRef,
}) {
  const { camera } = useThree();
  const desiredPosition = useRef(DEFAULT_CAMERA_POSITION.clone());
  const desiredTarget = useRef(DEFAULT_CAMERA_TARGET.clone());

  useFrame(() => {
    if (cameraMode === "default") {
      return;
    }

    if (cameraMode === "experiencePOV") {
      if (!experienceEyeRef.current || !experienceLookTargetRef.current) {
        return;
      }

      experienceEyeRef.current.getWorldPosition(desiredPosition.current);
      experienceLookTargetRef.current.getWorldPosition(desiredTarget.current);
    } else if (cameraMode === "panelFocus" && activePanelRef.current) {
      const panelPosition = activePanelRef.current.position;
      desiredPosition.current.set(panelPosition.x, panelPosition.y + 0.6, 2.8);
      desiredTarget.current.set(panelPosition.x, panelPosition.y, 0);
    } else if (cameraMode === "returnHome") {
      desiredPosition.current.copy(DEFAULT_CAMERA_POSITION);
      desiredTarget.current.copy(DEFAULT_CAMERA_TARGET);
    } else {
      return;
    }

    const positionLerp = cameraMode === "experiencePOV" ? 0.08 : 0.06;
    const targetLerp = cameraMode === "experiencePOV" ? 0.1 : 0.08;

    camera.position.lerp(desiredPosition.current, positionLerp);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredTarget.current, targetLerp);
      controlsRef.current.update();
    } else {
      camera.lookAt(desiredTarget.current);
    }
  });

  return null;
}

export default function XRScene() {
  const activePanelRef = useRef(null);
  const controlsRef = useRef(null);
  const experienceEyeRef = useRef(null);
  const experienceLookTargetRef = useRef(null);

  const [environmentFile, setEnvironmentFile] = useState("rogland_clear_night_4k.exr");
  const [activePanelKey, setActivePanelKey] = useState(null);
  const [cameraMode, setCameraMode] = useState("default");
  const [isPresenting, setIsPresenting] = useState(false);

  const isExperiencePOV = cameraMode === "experiencePOV";
  const isReturningHome = cameraMode === "returnHome";
  const orbitControlsLocked = isExperiencePOV || isReturningHome;

  useEffect(() => {
    if (isExperiencePOV || isReturningHome) {
      return;
    }

    setCameraMode(activePanelKey ? "panelFocus" : "default");
  }, [activePanelKey, isExperiencePOV, isReturningHome]);

  useEffect(() => {
    if (isPresenting) {
      return;
    }

    const handleKeyDown = (event) => {
      const target = event.target;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTypingTarget || event.repeat) {
        return;
      }

      if ((event.key === "e" || event.key === "E") && !isExperiencePOV && !isReturningHome) {
        setCameraMode("experiencePOV");
        return;
      }

      if (event.key === "Escape") {
        if (isExperiencePOV) {
          setCameraMode("returnHome");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExperiencePOV, isPresenting, isReturningHome]);

  useEffect(() => {
    if (!isExperiencePOV) {
      return;
    }

    window.dispatchEvent(new Event("close-map"));
  }, [isExperiencePOV]);

  useEffect(() => {
    if (isPresenting && isExperiencePOV) {
      setCameraMode("returnHome");
    }
  }, [isPresenting, isExperiencePOV]);

  useEffect(() => {
    if (!isReturningHome) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCameraMode("default");
    }, 850);

    return () => window.clearTimeout(timeoutId);
  }, [isReturningHome]);

  const handleExitExperience = () => {
    setCameraMode("returnHome");
  };

  const handleToggleExperience = () => {
    if (isPresenting) {
      return;
    }

    setCameraMode((currentMode) => {
      if (currentMode === "experiencePOV") {
        return "returnHome";
      }

      return "experiencePOV";
    });
  };

  return (
    <>
      <VRButton />

      <Canvas
        shadows
        camera={{ position: DEFAULT_CAMERA_POSITION.toArray(), fov: 55 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <OrbitControls
          ref={controlsRef}
          enabled={!isPresenting && !orbitControlsLocked}
          enableRotate={!orbitControlsLocked}
          enablePan={!orbitControlsLocked}
          enableZoom={!orbitControlsLocked}
          panSpeed={0.8}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          dampingFactor={0.08}
          enableDamping
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.PAN,
          }}
        />

        <Environment files={environmentFile} background />

        <directionalLight
          position={[5, 6, 5]}
          intensity={1}
          castShadow
          shadowBias={-0.0005}
        />
        <ambientLight intensity={0.5} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#999999" />
        </mesh>

        <axesHelper args={[3]} />

        <XR>
          <XRSessionBridge onPresentingChange={setIsPresenting} />

          <CameraRig
            activePanelRef={activePanelRef}
            cameraMode={cameraMode}
            controlsRef={controlsRef}
            experienceEyeRef={experienceEyeRef}
            experienceLookTargetRef={experienceLookTargetRef}
          />

          <ControlRoom
            activePanelRef={activePanelRef}
            onActivePanelChange={setActivePanelKey}
            experiencePOV={isExperiencePOV}
            isPresenting={isPresenting}
            onToggleExperience={handleToggleExperience}
            experienceEyeRef={experienceEyeRef}
            experienceLookTargetRef={experienceLookTargetRef}
          />
        </XR>
      </Canvas>

      <SceneControls setEnvironmentFile={setEnvironmentFile} />

      {isExperiencePOV && !isPresenting && (
        <button
          onClick={handleExitExperience}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 10000,
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(15, 23, 42, 0.92)",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          Exit Experience
        </button>
      )}

      <MapOverlay />
    </>
  );
}
