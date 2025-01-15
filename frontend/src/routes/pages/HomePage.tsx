import { DataList } from "@/components/home/DataList";
import Drone from "@/components/home/Drone";
import { HeroSection } from "@/components/home/HeroSection";
import { LoginModal } from "@/components/home/LoginModal";

export function HomePage() {
  return (
    <div className="relative">
      <LoginModal
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <Drone />
      {/* Main Content */}
      <HeroSection />
      <DataList />
    </div>
  );
}
