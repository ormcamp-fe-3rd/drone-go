import { useState, useEffect } from "react";
import { Header } from "./Header";

export function HeroSection() {
  const [currentText, setCurrentText] = useState("Your Turn to Review");

  const texts = [
    "Ready to Check the Path?",
    "Review the Details Now",
    "Your Turn to Review",
  ];

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setCurrentText(texts[index]);
      index = (index + 1) % texts.length; // 순차적으로 변경
    }, 3000); // 3초마다 문구 변경

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌을 정리
  }, []);

  return (
    <div className="relative mx-auto h-[1024px]">
      <Header />
      <img
        className="absolute bottom-0 z-20 h-full w-full"
        src="../public/images/cloud.svg"
        alt="cloud 이미지"
      />
      <div className="mx-auto max-w-screen-xl">
        {/* Background Video */}
        <video
          className="absolute left-0 top-0 z-0 my-0 h-[800px] w-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>

        {/* White Overlay */}
        <div className="absolute left-0 top-0 z-10 h-[1024px] w-full bg-white opacity-75"></div>

        {/* Content Section */}
        <div className="absolute z-20 ml-3">
          <div className="mt-32 text-[4.17vw] font-semibold leading-[5.5vw]">
            <p className="text-[#3D3D43]">Every Path Mapped</p>
            <p className="animate-slotMachine text-[#3027F1]">{currentText}</p>
          </div>
          <p className="mt-5 w-[60%] text-[14px] text-[#3D3D43]">
            Discover the best drones with real user reviews and expert insights.
            Our platform connects drone enthusiasts, offering detailed mobility
            reviews, performance comparisons, and tips for every skill level.
            Share your experiences and explore the perfect drone for your needs!
          </p>
        </div>
      </div>
    </div>
  );
}
