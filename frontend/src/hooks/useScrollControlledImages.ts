import { useEffect, useRef } from "react"; // useState는 불필요하므로 제거
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollControlledImages = (imageClasses: string[]) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      imageClasses.forEach((imageClass, index) => {
        const prevImage = imageClasses[index - 1];
        const start =
          index === 0 ? "top top" : `center+=${index * 50}px center`;
        const end = `center+=${(index + 1) * 50}px center`;

        // 이미지 애니메이션 설정
        gsap.to(`.${imageClass}`, {
          opacity: 1,
          y: "0", // 기본 위치로 애니메이션
          scrollTrigger: {
            trigger: containerRef.current, // containerRef를 트리거로 설정
            start,
            end,
            scrub: true, // 스크롤에 따라 애니메이션 동기화
          },
        });

        // 이전 이미지를 비활성화
        if (prevImage) {
          gsap.to(`.${prevImage}`, {
            opacity: 0,
            scrollTrigger: {
              trigger: containerRef.current,
              start,
              end,
              scrub: true,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert(); // Clean up
  }, [imageClasses]);

  return {
    containerRef,
  };
};
