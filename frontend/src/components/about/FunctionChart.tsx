import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function FunctionChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (chartRef.current) {
      const chartElement = chartRef.current.querySelector(".chart");

      // 화면 크기 변화에 따라 start와 end 값을 동적으로 계산
      const updateScrollTrigger1 = () => {
        const start = "top 5%";
        const end = `+=3000`;

        ScrollTrigger.getById("chartAnimation")?.kill(); // 기존 ScrollTrigger 제거

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "chartAnimation",
            pin: true,
            trigger: chartElement,
            start: start,
            end: end,
            scrub: 1,
            markers: false,
          },
        });

        tl.fromTo(
          ".chart ul li:nth-child(2)",
          { opacity: 0, y: 0 },
          {
            opacity: 1,
            y: 0,
            duration: 5,
            ease: "power2.out",
          },
        );
      };

      // 초기 설정
      updateScrollTrigger1();

      // 화면 크기 변경 시 ScrollTrigger 업데이트
      window.addEventListener("resize", updateScrollTrigger1);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        window.removeEventListener("resize", updateScrollTrigger1);
        ScrollTrigger.getById("chartAnimation")?.kill(); // ScrollTrigger 정리
      };
    }
  }, []);

  return (
    <div ref={chartRef}>
      <div className="chart relative aspect-[10/7] w-full py-10 lg:w-[920px]">
        <img
          className="absolute drop-shadow-lg"
          src="/images/introduce/section01-chart-01.png"
          alt="기능소개 배경"
        />
        <ul>
          <li>
            <img
              className="chart1 absolute"
              src="/images/introduce/section01-chart-01.png"
              alt="기능소개 문구1"
            />
          </li>
          <li>
            <img
              className="chart2 absolute"
              src="/images/introduce/section01-chart-02.png"
              alt="기능소개 문구2"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
