import { Text } from "@react-three/drei";
import { useState } from "react";

export default function Panel3D({ title, children, isActive }) {
  const [hovered, setHovered] = useState(false);

  // 🎨 Color palette (easy to tweak later)
  const baseColor = "#141414";          // panel body
  const hoverGlow = "#3aa6ff";          // soft blue (hover)
  const activeGlow = "#2ef2c9";         // teal/cyan (active)

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
        <boxGeometry args={[1.6, 0.9, 0.06]} />
        <meshStandardMaterial
          color={baseColor}

          // ✨ Glow logic
          emissive={
            isActive
              ? activeGlow
              : hovered
              ? hoverGlow
              : "#000000"
          }
          emissiveIntensity={
            isActive
              ? 0.35     // focused but calm
              : hovered
              ? 0.22     // subtle hover cue
              : 0
          }

          // 🎯 Material feel (IMPORTANT)
          roughness={0.35}   // slightly glossy
          metalness={0.15}   // subtle industrial feel
        />
      </mesh>

      {/* TITLE */}
      <Text
        position={[0, 0.38, 0.09]}
        fontSize={0.07}
        color={isActive ? "#eafffb" : "#ffffff"}
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
