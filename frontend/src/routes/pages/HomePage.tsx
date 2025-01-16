import { DataList } from "@/components/home/DataList";
import Drone from "@/components/home/Drone";
import { HeroSection } from "@/components/home/HeroSection";

export function HomePage() {
  return (
    <div className="relative">
      {/* Tailwind 클래스를 사용하여 드론 위치 조정 */}
      <div className="absolute right-0 top-10 h-[25vh] w-[25vw]">
        <Drone scale={110} rotation={[0, -110, 0]} yAnimationHeight={5} />
      </div>

      {/* Main Content */}
      <HeroSection />
      <DataList />
    </div>
  );
}
