import { useEffect, useState } from "react";
import { HomeHeader } from "./HomeHeader";

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
      index = (index + 1) % texts.length;
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const scrollToDataList = () => {
    const element = document.getElementById("DataList");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative mx-auto h-[1024px]">
      <HomeHeader />
      <div className="mx-auto max-w-screen-xl">
        {/* Background Video */}
        <video
          className="absolute left-0 top-0 my-0 h-[800px] w-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>

        {/* White Overlay */}
        <div className="absolute left-0 top-0 h-[1024px] w-full bg-white opacity-75"></div>

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
          <button
            onClick={scrollToDataList}
            className="relative z-30 mt-5 h-[34px] rounded-[8px] bg-[#2F2929] px-3 text-sm text-white"
          >
            View Reviews
          </button>
        </div>

        <img
          className="absolute bottom-20 left-0 z-10 h-full w-full object-cover"
          src="../public/images/cloud.svg"
          alt="cloud 이미지"
        />
      </div>
    </div>
  );
}
