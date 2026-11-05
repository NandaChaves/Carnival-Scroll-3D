import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import { Loader } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Mask from "./Mask";
import Background from "./Background";
import AnimatedText from "./AnimatedText";

gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  const scrollData = useMemo(() => ({ value: 0 }), []);

  useEffect(() => {
    const animation = gsap.to(scrollData, {
      value: 1,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    return () => animation.kill();
  }, [scrollData]);

  return (
    <>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
        }}
        camera={{
          position: [0, 0, 15],
          fov: 35,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[10, 10, 10]}
          intensity={2}
        />

        <pointLight
          position={[-10, -10, -10]}
          color="white"
          intensity={1}
        />

        <Suspense fallback={null}>
          <Background progress={scrollData} />
          <Mask progress={scrollData} />
          <AnimatedText progress={scrollData} />
        </Suspense>
      </Canvas>

      <Loader
        containerStyles={{
          position: "fixed",
          zIndex: 9999,
          background: "#101016",
        }}
      />
    </>
  );
}