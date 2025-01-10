import { SignButton } from "./main/SignButton";

export function Header() {
  return (
    <div className="mx-auto max-w-screen-xl">
      {/* Header Section */}
      <div className="relative z-20 mx-auto mt-[4%] flex items-end justify-between">
        <div className="ml-3 flex items-end gap-2">
          <img
            className="h-8 w-8"
            src="../public/icons/drone.svg"
            alt="Drone Icon"
          />
          <p className="text-3xl font-bold text-[#0800A1]">DronGo</p>
          <p className="ml-6 text-sm text-[#353740]">Introduce</p>
        </div>
        <div className="mr-3 flex gap-4">
          <SignButton text="SIGN UP" bgColor="white" />
          <SignButton text="SIGN IN" bgColor="black" />
        </div>
      </div>

      {/* Background Video */}
      <video
        className="absolute left-0 top-0 -z-10 h-full w-full object-cover"
        autoPlay
        muted
        loop
      >
        <source src="/videos/video.mp4" type="video/mp4" />
      </video>

      {/* White Overlay */}
      <div className="absolute left-0 top-0 z-0 h-full w-full bg-white opacity-60"></div>

      {/* Content Section */}
      <div className="relative z-10 ml-3">
        <div className="mt-32 text-[4.17vw] font-semibold leading-[5.5vw]">
          <p className="text-[#3D3D43]">Every Path Mapped</p>
          <p className="text-[#3027F1]">Your Turn to Review</p>
        </div>
        <p className="mt-5 w-[40%] text-[14px] text-[#3D3D43]">
          Discover the best drones with real user reviews and expert insights.
          Our platform connects drone enthusiasts, offering detailed mobility
          reviews, performance comparisons, and tips for every skill level.
          Share your experiences and explore the perfect drone for your needs!
        </p>
      </div>
    </div>
  );
}
