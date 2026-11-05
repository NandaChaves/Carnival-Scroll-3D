import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

export default function Mask({ progress }) {
  const group = useRef()
  const { scene: sceneA } = useGLTF("/masks/mask_A.glb")
  const { scene: sceneB } = useGLTF("/masks/mask_B.glb")

  useEffect(() => {
    [sceneA, sceneB].forEach((s) => {
      s.traverse((child) => {
        if (child.isMesh) {
          child.geometry.center()
          child.material.side = THREE.FrontSide
        }
      })
    })
  }, [sceneA, sceneB])

  useFrame(() => {
    if (!group.current) return
    const p = progress.value

    // Rotação proporcional 0 → 360°
    group.current.rotation.y = p * Math.PI

    // Máscara diminui suavemente
    const initialScale = 5
    const minScale = 3.5
    const scale = initialScale - (initialScale - minScale) * p
    group.current.scale.set(scale, scale, scale)
  })

  return (
    <group ref={group} position={[0, 0, 4]}>
      <primitive object={sceneA} />
      <primitive object={sceneB} rotation={[0, Math.PI, 0]} />
    </group>
  )
}