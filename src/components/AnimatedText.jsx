import { Text } from "@react-three/drei"
import { useRef } from "react"
import { useFrame, extend } from "@react-three/fiber"
import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei"

// --- ShaderMaterial para gradiente + glow ---
const GradientGlowMaterial = shaderMaterial(
  { uTime: 0, color1: new THREE.Color("#D4AF37"), color2: new THREE.Color("#9B111E"),  uOpacity: 1},
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `,
  `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  void main() {
    float glow = sin(uTime + vUv.y * 3.1415) * 0.5 + 0.5;
    vec3 color = mix(color1, color2, vUv.y) + glow * 0.05;
    gl_FragColor = vec4(color, 1.0) * uOpacity;
  }
  `
)

extend({ GradientGlowMaterial })

export default function AnimatedText({ progress }) {
  const frontRef = useRef()
  const backRef = useRef()
  const frontMatRef = useRef()
  const backMatRef = useRef()

  useFrame(({ clock }) => {
    const p = progress.value

    // Frente
    frontRef.current.position.y = THREE.MathUtils.lerp(0.5, 2, p)
    frontRef.current.scale.setScalar(1 - p * 0.2)
    if (frontMatRef.current) frontMatRef.current.uTime = clock.getElapsedTime()

    // Atrás
    const backP = Math.max(0, (p - 0.5) * 2)
    backRef.current.position.y = THREE.MathUtils.lerp(2, 0.5, backP)
    backRef.current.scale.setScalar(0.8 + backP * 0.2)
    if (backMatRef.current) {
    backMatRef.current.uTime = clock.getElapsedTime()
    backMatRef.current.uOpacity = backP // <--- Atualiza a opacidade no shader
}
  })

  return (
    <>
      {/* Texto da frente */}
      <Text
        ref={frontRef}
        position={[0, 0.5, 6]}
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
      >
          <Text
          position={[0.03, -0.03, -0.01]}
          fontSize={0.8}
          anchorX="center"
          anchorY="middle"
          color="black"
          material-transparent
          material-opacity={0.3}
        ></Text>

        Discover Venice
        <gradientGlowMaterial ref={frontMatRef} attach="material" />
      </Text>

      {/* Texto de trás */}
      <Text
        ref={backRef}
        position={[0, 2, 6]}
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
      >
        With Us
        <gradientGlowMaterial ref={backMatRef} attach="material" />
      </Text>
    </>
  )
}