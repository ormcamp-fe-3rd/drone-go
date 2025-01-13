import FunctionSection from "@/components/introduce/FunctionSection";
import TeamSection from "@/components/introduce/TeamSection";
import UsecaseSection from "@/components/introduce/UsecaseSection";
import WelcomeSection from "@/components/introduce/WelcomeSection";

export default function IntroducePage(){
  return (
      <div className="flex flex-col items-center gap-40 mt-32">
        <WelcomeSection />
        <FunctionSection />
        <UsecaseSection />
        <TeamSection />
      </div>
  );
}