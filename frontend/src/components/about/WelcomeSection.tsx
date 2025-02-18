export default function WelcomeSection() {
  return (
    <div className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-10 text-center">
      <div className="text-6xl font-semibold text-title">
        Welcome to Our Platform
      </div>
      <p className="subtitle">
        Discover the best drones with real user reviews and expert insights.{" "}
        <br />
        Our platform connects drone enthusiasts, offering detailed mobility
        reviews, performance comparisons, <br />
        and tips for every skill level. Share your experiences and explore the
        perfect drone for your needs!
      </p>
      <div>
        <img src="/images/introduce/drone.png" alt="" />
      </div>
    </div>
  );
}
