// // src/components/TextValue3D.jsx
// import { Text } from "@react-three/drei";

// export default function TextValue3D({ label, value, position }) {
//   return (
//     <group position={position}>
//       <Text fontSize={0.4} color="#00ff00">
//         {label}: {value}
//       </Text>
//     </group>
//   );
// }






// import { Text } from "@react-three/drei";

// export default function TextValue3D({ label, value, position }) {
//   return (
//     <Text
//       position={position}
//       fontSize={0.08}
//       color="#6dff6d"
//       anchorX="center"
//       anchorY="middle"
//     >
//       {label}: {value}
//     </Text>
//   );
// }





import { Text } from "@react-three/drei";

export default function TextValue3D({ label, value, position }) {
  return (
    <Text
      position={position}
      fontSize={0.08}
      color="#6dff6d"
      anchorX="center"
      anchorY="middle"
      depthTest={false}   // ✅ keep this
    >
      {label}: {value}
    </Text>
  );
}
