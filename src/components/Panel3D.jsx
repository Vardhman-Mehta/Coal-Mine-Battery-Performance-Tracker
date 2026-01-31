import { Text } from "@react-three/drei";

export default function Panel3D({ title, children, isActive }) {
  return (
    <group>

      {/* PANEL BODY */}
      <mesh
        castShadow
        receiveShadow={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          e.object.material.color.set("#1f1f1f");
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          e.object.material.color.set("#141414");
        }}
      >
        <boxGeometry args={[1.6, 0.9, 0.05]} />
        <meshStandardMaterial
          color="#141414"
          emissive={isActive ? "#1aff1a" : "#000000"}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* TITLE */}
      <Text
        position={[0, 0.38, 0.08]}
        fontSize={0.07}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        depthTest={false}
      >
        {title}
      </Text>

      {/* CONTENT */}
      <group position={[0, -0.05, 0.08]}>
        {children}
      </group>

    </group>
  );
}
