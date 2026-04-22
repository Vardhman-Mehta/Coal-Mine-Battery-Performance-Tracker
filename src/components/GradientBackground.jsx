import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const DEFAULT_GRADIENT_COLORS = ["#09111f", "#16365e", "#7cb3ff"];

const vertexShader = `
  varying vec3 vDirection;

  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vDirection;

  void main() {
    vec3 direction = normalize(vDirection);
    float flowA = sin(uTime * 0.10 + direction.x * 3.1 + direction.z * 2.4);
    float flowB = cos(uTime * 0.08 - direction.z * 3.5 + direction.x * 1.7);
    float flowC = sin(uTime * 0.06 + (direction.x + direction.z) * 4.0);
    float drift = flowA * 0.035 + flowB * 0.025;
    float ribbon = flowC * 0.04;
    float verticalMix = clamp(direction.y * 0.5 + 0.5 + drift + ribbon, 0.0, 1.0);

    vec3 gradient = mix(uColorA, uColorB, smoothstep(0.0, 0.58, verticalMix));
    gradient = mix(gradient, uColorC, smoothstep(0.52, 1.0, verticalMix));

    float centerBias = pow(max(0.0, 1.0 - length(direction.xz) * 0.9), 2.0);
    float horizonGlow = pow(1.0 - abs(direction.y), 2.2) * 0.16;
    float ambientSweep = sin(uTime * 0.12 + direction.x * 5.2 - direction.z * 3.1) * 0.5 + 0.5;
    float auroraBand = smoothstep(0.25, 0.95, ambientSweep) * (1.0 - abs(direction.y - 0.1));

    vec3 finalColor = gradient;
    finalColor += uColorB * centerBias * 0.22;
    finalColor += uColorC * horizonGlow * 0.1;
    finalColor += mix(uColorB, uColorC, ambientSweep) * auroraBand * 0.12;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function GradientBackground({
  colors = DEFAULT_GRADIENT_COLORS,
  motion = "subtle",
}) {
  const materialRef = useRef(null);
  const meshRef = useRef(null);
  const { camera } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(DEFAULT_GRADIENT_COLORS[0]) },
      uColorB: { value: new THREE.Color(DEFAULT_GRADIENT_COLORS[1]) },
      uColorC: { value: new THREE.Color(DEFAULT_GRADIENT_COLORS[2]) },
    }),
    []
  );

  useEffect(() => {
    uniforms.uColorA.value.set(colors[0] || DEFAULT_GRADIENT_COLORS[0]);
    uniforms.uColorB.value.set(colors[1] || DEFAULT_GRADIENT_COLORS[1]);
    uniforms.uColorC.value.set(colors[2] || DEFAULT_GRADIENT_COLORS[2]);
  }, [colors, uniforms]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) {
      return;
    }

    meshRef.current.position.copy(camera.position);
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.012;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    materialRef.current.uniforms.uTime.value =
      motion === "subtle" ? state.clock.elapsedTime : 0;
  });

  return (
    <mesh ref={meshRef} renderOrder={-1000} frustumCulled={false}>
      <sphereGeometry args={[90, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
