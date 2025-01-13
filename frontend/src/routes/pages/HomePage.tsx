import { DataList } from "@/components/main/DataList";
import { HeroSection } from "@/components/main/HeroSection";

export function HomePage() {
  return (
    <div className="h-[2048px]">
      <HeroSection />
      <DataList />
    </div>
  );
}
