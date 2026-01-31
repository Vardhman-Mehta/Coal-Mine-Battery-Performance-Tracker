


// import { useLoader } from "@react-three/fiber";
// import { TextureLoader } from "three";

// export default function MapPlane3D({ position }) {
//   const texture = useLoader(TextureLoader, "/map-placeholder.png");

//   return (
//     <group position={position}>
//       <mesh>
//         <planeGeometry args={[1.6, 0.9]} />
//         <meshStandardMaterial
//           map={texture}
//           opacity={0.9}
//           transparent
//         />
//       </mesh>
//     </group>
//   );
// }




// import { useLoader } from "@react-three/fiber";
// import { TextureLoader, ClampToEdgeWrapping } from "three";

// export default function MapPlane3D({ position }) {
//   const texture = useLoader(TextureLoader, "/map-placeholder.png");

//   texture.wrapS = ClampToEdgeWrapping;
//   texture.wrapT = ClampToEdgeWrapping;

//   return (
//     <group position={position}>
//       <mesh position={[0, 0, 0]}>
//         <planeGeometry args={[1.6, 0.9]} />
//         <meshStandardMaterial
//           map={texture}
//           transparent
//           opacity={0.5}
//           depthWrite={false}   // ⬅ IMPORTANT
//         />
//       </mesh>
//     </group>
//   );
// }




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
          opacity={0.6}
          depthTest={false}   // 🔴 KEY LINE
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
