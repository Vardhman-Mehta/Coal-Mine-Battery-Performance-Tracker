import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function MapPlane3D({ position }) {
  const texture = useLoader(TextureLoader, "/map-placeholder.png");

  return (
    <group position={position} renderOrder={0}>
      <mesh renderOrder={0}>
        <planeGeometry args={[1.6, 0.9]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.9}
          depthTest={false}   // 🔴 KEY LINE
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}