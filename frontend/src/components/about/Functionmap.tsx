import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

export function FunctionMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mapRef.current) return;

    // 화면 크기 변화에 따라 start와 end 값을 동적으로 계산
    const start = "top 5%";
    const end = "+=3000";

    // 기존 ScrollTrigger 제거
    ScrollTrigger.getById("mapAnimation")?.kill();

    const t2 = gsap.timeline({
      scrollTrigger: {
        id: "mapAnimation",
        pin: true,
        pinSpacing: true,
        trigger: mapRef.current,
        start: start,
        end: end,
        scrub: 1,
        markers: false, //
      },
    });

    t2.fromTo(
      ".map1", //
      { opacity: 0, y: 0 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
    );
    t2.fromTo(
      ".map2", //
      { opacity: 0, y: 0 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
    );

    return () => {
      ScrollTrigger.getById("mapAnimation")?.kill();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="map relative my-20 aspect-[10/7] w-full lg:w-[920px]"
    >
      <img
        className="absolute drop-shadow-lg"
        src="/images/introduce/section01-map-bg.png"
        alt=""
      />
      <img
        className="absolute"
        src="/images/introduce/section01-map-01.png"
        alt=""
      />
      <img
        className="map1 absolute"
        src="/images/introduce/section01-map-02.png"
        alt=""
      />
      <img
        className="map2 absolute"
        src="/images/introduce/section01-map-03.png"
        alt=""
      />
    </div>
  );
}
