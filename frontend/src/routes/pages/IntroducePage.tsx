import FunctionSection from "@/components/introduce/FunctionSection";
import TeamSection from "@/components/introduce/TeamSection";
import UsecaseSection from "@/components/introduce/UsecaseSection";

export default function IntroducePage(){
  return (
    <div className="flex flex-col items-center gap-40">
      <FunctionSection />
      <UsecaseSection />
      <TeamSection />
    </div>
  );
}