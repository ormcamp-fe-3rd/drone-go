import { HeroSection } from "@/components/main/HeroSection";
import { DataList } from "@/components/main/DataList";
import Drone from "@/components/main/Drone";

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
