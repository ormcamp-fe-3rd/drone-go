import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DataList } from "@/components/home/DataList";
import Drone from "@/components/home/Drone";
import { HeroSection } from "@/components/home/HeroSection";

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const droneRef = useRef<HTMLDivElement>(null);
  const dataListRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([
    0, -110, 0,
  ]);

  useEffect(() => {
    if (droneRef.current) {
      // gsap 애니메이션을 droneRef에 적용하고 ScrollTrigger 사용
      gsap.to(droneRef.current, {
        x: "-150vw", // 왼쪽으로 이동 (현재 위치에서 왼쪽 50% 만큼 이동)
        y: "90vh", // 아래로 이동 (현재 위치에서 아래로 140% 만큼 이동)

        duration: 10, // 이동 시간 (10초)
        ease: "power2.out", // 이징 효과 (부드러운 애니메이션)
        scrollTrigger: {
          trigger: dataListRef.current, // 트리거 요소 (DataList 섹션)
          start: "top bottom", // 데이터 리스트가 화면에 80% 정도 들어왔을 때 애니메이션 시작
          end: "bottom top", // 데이터 리스트가 화면에서 벗어나기 직전까지 애니메이션 종료
          scrub: true, // 스크롤에 맞춰 애니메이션을 동기화
          markers: false, // 마커 표시를 제거
          onUpdate: (self) => {
            // 스크롤 진행에 따라 rotation.y 값을 동적으로 변화
            const rotationValue = gsap.utils.interpolate(
              -110,
              110,
              self.progress,
            );
            // rotation 상태 업데이트
            setRotation([0, rotationValue, 0]);
          },
        },
      });
    }
  }, []);

  return (
    <div className="relative">
      {/* gsap 애니메이션을 적용할 Drone 컴포넌트 */}
      <div
        className="absolute right-0 top-0 z-50 h-[25vh] w-[25vw]" // z-50을 추가하여 드론이 최상위에 배치
        ref={droneRef}
      >
        {/* rotation을 상태로 관리하여 업데이트 */}
        <Drone scale={110} rotation={rotation} yAnimationHeight={5} />
      </div>

      {/* Main Content */}
      <HeroSection />
      <div ref={dataListRef}>
        <DataList />
      </div>
    </div>
  );
}
