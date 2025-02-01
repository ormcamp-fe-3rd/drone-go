import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContext, useEffect, useRef, useState } from "react";

import DroneList from "@/components/home/DataList";
import Drone from "@/components/home/Drone";
import { HeroSection } from "@/components/home/HeroSection";
import { AuthContext } from "@/contexts/AuthContext";

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const droneRef = useRef<HTMLDivElement>(null);
  const dataListRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([
    0, -110, 0,
  ]);
  const {isAuth} = useContext(AuthContext);


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
        <div className="mx-auto mb-10 flex h-[1024px] flex-col items-center justify-center text-center">
          <p className="title" id="DataList">
            Select the Drone
          </p>
          <p className="subtitle mt-2">
            Select a drone and view its data visualization.
          </p>
          <div className="relative mt-10 flex h-auto min-h-[37.5rem] w-[75rem] items-center justify-center">
            <div className="mx-auto relative h-[300px] w-[300px] rounded border-2 border-[#B2B7B7] bg-white py-16">
              <div>
                <img
                  className="absolute left-9 top-10 transition-all duration-300 ease-in-out group-hover:left-4 group-hover:top-5 group-active:left-4 group-active:top-5"
                  src="/images/card-left-up.svg"
                  alt="카드 좌상 상세 디자인"
                />
                <img
                  className="absolute right-9 top-10 transition-all duration-300 ease-in-out group-hover:right-4 group-hover:top-5 group-active:right-4 group-active:top-5"
                  src="/images/card-right-up.svg"
                  alt="카드 우상 상세 디자인"
                />
                <img
                  className="absolute bottom-10 left-9 transition-all duration-300 ease-in-out group-hover:bottom-5 group-hover:left-4 group-active:bottom-5 group-active:left-4"
                  src="/images/card-left-down.svg"
                  alt="카드 좌하 상세 디자인"
                />
                <img
                  className="absolute bottom-10 right-9 transition-all duration-300 ease-in-out group-hover:bottom-5 group-hover:right-4 group-active:bottom-5 group-active:right-4"
                  src="/images/card-right-down.svg"
                  alt="카드 우하 상세 디자인"
                />
              </div>
              <div className="mx-auto flex h-[100px] w-[200px] items-center justify-center blur-sm">
                <img src="/images/drone-01.svg" alt="드론" />
              </div>
            </div>
            <div className="absolute h-[300px] w-full text-4xl">
              <div className="flex h-full items-center justify-center font-light italic text-click">
                Please sign in to view the drone data.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
