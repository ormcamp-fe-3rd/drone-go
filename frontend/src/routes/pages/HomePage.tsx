import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContext, useEffect, useRef, useState } from "react";

import DroneList from "@/components/home/DataList";
import Drone from "@/components/home/Drone";
import { HeroSection } from "@/components/home/HeroSection";
import UnloggedDroneList from "@/components/home/UnloggedDroneList";
import { AuthContext } from "@/contexts/AuthContext";

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const droneRef = useRef<HTMLDivElement>(null);
  const dataListRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([
    0, -110, 0,
  ]);
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    if (droneRef.current) {
      gsap.to(droneRef.current, {
        x: "-100vw",
        y: "200vh",

        duration: 10,
        ease: "power2.out",
        scrollTrigger: {
          trigger: dataListRef.current,
          start: "top 60%",
          end: "bottom top",
          scrub: true,
          markers: false,
          onUpdate: (self) => {
            const rotationValue = gsap.utils.interpolate(
              -110,
              110,
              self.progress,
            );

            setRotation([0, rotationValue, 0]);
          },
        },
      });
    }
  }, []);

  return (
    <div className="relative">
      <div
        className="absolute right-0 top-56 z-50 h-[25vh] w-[25vw]" // z-50을 추가하여 드론이 최상위에 배치
        ref={droneRef}
      >
        <Drone
          scale={110}
          rotation={rotation}
          yAnimationHeight={5}
          height={"80vh"}
          width={"70vw"}
        />
      </div>
      {/* Main Content */}
      <HeroSection />
      {isAuth ? (
        <div ref={dataListRef}>
          <DroneList />
        </div>
      ) : (
        <UnloggedDroneList />
      )}
    </div>
  );
}
