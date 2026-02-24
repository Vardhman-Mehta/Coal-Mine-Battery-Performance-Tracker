import { Text } from "@react-three/drei";
import { useState } from "react";

export default function Panel3D({ title, children, isActive }) {
  const [hovered, setHovered] = useState(false);

  // 🎨 Color palette
  const baseColor = "#1b1b1b";
  const hoverGlow = "#4fd1c5";     // soft teal
  const activeGlow = "#22ff88";    // clean green

  return (
    <group
      rotation={[
        hovered ? -0.04 : 0,
        hovered ? 0.04 : 0,
        0,
      ]}
    >
      {/* PANEL BODY */}
      <mesh
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <boxGeometry args={[1.6, 0.9, 0.08]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.35}
          metalness={0.1}
          emissive={
            isActive
              ? activeGlow
              : hovered
              ? hoverGlow
              : "#000000"
          }
          emissiveIntensity={
            isActive ? 0.35 : hovered ? 0.18 : 0
          }
        />
      </mesh>

      {/* TITLE */}
      <Text
        position={[0, 0.38, 0.09]}
        fontSize={0.07}
        color={isActive ? "#eafff5" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        depthTest={false}
      >
        {title}
      </Text>

      {/* CONTENT */}
      <group position={[0, -0.05, 0.09]}>
        {children}
      </group>
    </group>
  );
}
