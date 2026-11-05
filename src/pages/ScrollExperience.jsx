import { useScroll } from "framer-motion";
import { useRef } from "react";
import VeniceScene from "../components/VeniceScene";

export default function ScrollExperience() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={ref} style={{ height: "400vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh" }}>
        <VeniceScene progress={scrollYProgress} />
      </div>
    </div>
  );
}