import { DataList } from "@/components/home/DataList";
import Drone from "@/components/home/Drone";
import { HeroSection } from "@/components/home/HeroSection";

export function HomePage() {
  return (
    <div>
      <Drone scale={110} rotation={[0, -110, 0]} yAnimationHeight={5} />
      {/* Main Content */}
      <HeroSection />
      <DataList />
    </div>
  );
}
