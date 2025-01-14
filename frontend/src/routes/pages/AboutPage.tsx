import FunctionSection from "@/components/about/FunctionSection";
import TeamSection from "@/components/about/TeamSection";
import UsecaseSection from "@/components/about/UsecaseSection";
import WelcomeSection from "@/components/about/WelcomeSection";

export default function IntroducePage(){
  return (
      <div className="flex flex-col items-center gap-40 mt-32 mx-6">
        <WelcomeSection />
        <FunctionSection />
        <UsecaseSection />
        <TeamSection />
      </div>
  );
}