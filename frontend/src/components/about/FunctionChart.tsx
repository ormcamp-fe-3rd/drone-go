import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export function FunctionChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      // GSAP Timeline 정의
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chartRef.current.querySelector(".chart"), // 트리거 대상
          start: "top 0%", // 첫 번째 요소가 화면의 정중앙에 올 때 시작
          end: "bottom 100%", // 화면 중간에서 끝나도록 설정 (스크롤이 다 내려가야 끝남)
          scrub: 1, // 스크롤과 애니메이션을 완전히 동기화
          markers: false, // 디버깅용 마커 표시
        },
      });

      // 두 번째 요소 애니메이션 (기능소개 문구2만)
      tl.fromTo(
        ".chart ul li:nth-child(2)", // 두 번째 문구(기능소개 문구2)만 애니메이션
        { opacity: 0, y: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 5,
          ease: "power2.out",
        },
      );
    }
  }, []);

  return (
    <div ref={chartRef}>
      {/* chart 기능 소개 */}
      <div className="chart relative aspect-[10/7] w-full py-10 lg:w-[920px]">
        {/* 배경 이미지 */}
        <img
          className="absolute drop-shadow-lg"
          src="/public/images/introduce/section01-chart-01.png"
          alt="기능소개 배경"
        />
        <ul>
          <li>
            {/* 배경을 제외한 첫 번째 문구는 애니메이션 적용하지 않음 */}
            <img
              className="chart1 absolute"
              src="/public/images/introduce/section01-chart-01.png"
              alt="기능소개 문구1"
            />
          </li>
          <li>
            {/* 두 번째 문구에만 애니메이션 적용 */}
            <img
              className="chart2 absolute"
              src="/public/images/introduce/section01-chart-02.png"
              alt="기능소개 문구2"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
