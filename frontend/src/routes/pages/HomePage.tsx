import { DataList } from "@/components/main/DataList";
import { Header } from "@/components/main/Header";
import { HeroSection } from "@/components/main/HeroSection";

export function HomePage() {
  return (
    <div className="h-[2048px]">
      <Header />
      <HeroSection />
      <DataList />
    </div>
  );
}
