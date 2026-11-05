import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { useScroll } from "@react-three/drei"
import * as THREE from "three"

function RotatingMask({ scrollProgress }) {
  const group = useRef()

  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y = scrollProgress.current * Math.PI
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Segunda máscara virada */}
      <mesh rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  )
}