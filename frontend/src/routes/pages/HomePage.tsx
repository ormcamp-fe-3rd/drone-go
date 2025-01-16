import { DataList } from "@/components/home/DataList";
import Drone from "@/components/home/Drone";
import { HeroSection } from "@/components/home/HeroSection";

export function HomePage() {
  return (
    <div className="relative">
      <Drone />
      {/* Main Content */}
      <HeroSection />
      <DataList />
    </div>
  );
}
