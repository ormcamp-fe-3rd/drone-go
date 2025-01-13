import { Header } from "@/components/main/Header";
import { HeroSection } from "@/components/main/HeroSection";
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
