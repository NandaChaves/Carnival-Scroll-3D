import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useTexture } from "@react-three/drei"
import * as THREE from "three"

export default function Background({ progress }) {
  const group = useRef()
  const { viewport, camera } = useThree()
  const { scene } = useGLTF("/textures/background_fractured.glb")
  const background2 = useTexture("/textures/background_2.jpg")

  const fragments = useMemo(() => {
    const data = []
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true
        child.material.depthWrite = false
        data.push({
          mesh: child,
          originalPos: child.position.clone(),
          direction: new THREE.Vector3(child.position.x, child.position.y, 0).normalize()
        })
      }
    })
    return data
  }, [scene])

  const bgScale = useMemo(() => {
    const distance = camera.position.z - (-10)
    const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * distance
    const width = height * (viewport.width / viewport.height)
    return [width, height, 1]
  }, [camera, viewport])

  const screenHeight = useMemo(() => {
    const distance = camera.position.z - 0
    return 2 * Math.tan((camera.fov * Math.PI) / 360) * distance
  }, [camera])

  useFrame((state) => {
    const p = progress.value

    // Suavização estilo easeInOutQuad
    const smoothP = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p

    const maxDistance = screenHeight * 0.2

    fragments.forEach((item) => {
      item.mesh.position.x = item.originalPos.x + item.direction.x * maxDistance * smoothP
      item.mesh.position.y = item.originalPos.y + item.direction.y * maxDistance * smoothP
      item.mesh.position.z = item.originalPos.z
      item.mesh.rotation.x = smoothP * 0.8
      item.mesh.rotation.y = smoothP * 0.8

      // Pequena escala para profundidade cinematográfica
      const scale = 1 - smoothP * 0.05
      item.mesh.scale.set(scale, scale, scale)
    })

    // Micro movimento de câmera para efeito cinematográfico
    state.camera.position.z = 15 - smoothP * 2
    state.camera.position.y = smoothP * 0.5
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Plano de fundo cobrindo tela */}
      <mesh position={[0, 0, -10]} scale={bgScale}>
        <planeGeometry />
        <meshStandardMaterial map={background2} />
      </mesh>

      {/* Fragments animados */}
      <primitive ref={group} object={scene} scale={[10, 8, 5]} position={[0, 0, 0]} />
    </>
  )
}