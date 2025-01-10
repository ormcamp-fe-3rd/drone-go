import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DataList } from "@/components/main/DataList";

export function HomePage() {
  return (
    <div className="h-[2048px]">
      <Header />
      <HeroSection />
      <DataList />
    </div>
  );
}
