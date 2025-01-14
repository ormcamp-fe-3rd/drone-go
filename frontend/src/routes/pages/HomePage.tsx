import { HeroSection } from "@/components/main/HeroSection";
import { DataList } from "@/components/main/DataList";
import Drone from "@/components/main/Drone";
import { LoginModal } from "@/components/main/LoginModal";

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
