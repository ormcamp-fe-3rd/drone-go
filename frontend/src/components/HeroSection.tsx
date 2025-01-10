export function HeroSection() {
  return (
    <div className="mx-auto">
      <img
        className="absolute bottom-0 h-[auto] w-full"
        src="../public/images/cloud.svg"
        alt="cloud 이미지"
      />
      <div className="mx-auto max-w-screen-xl">
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
        <div className="absolute left-0 top-0 z-0 h-full w-full bg-white opacity-75"></div>

        {/* Content Section */}
        <div className="relative z-10 ml-3">
          <div className="mt-32 text-[4.17vw] font-semibold leading-[5.5vw]">
            <p className="text-[#3D3D43]">Every Path Mapped</p>
            <p className="text-[#3027F1]">Your Turn to Review</p>
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
