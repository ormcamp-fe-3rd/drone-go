import FunctionSection from "@/components/about/FunctionSection";
import ResetScrollBtn from "@/components/about/resetScrollbtn";
import TeamSection from "@/components/about/TeamSection";
import UsecaseSection from "@/components/about/UsecaseSection";
import WelcomeSection from "@/components/about/WelcomeSection";
import { HomeHeader } from "@/components/home/HomeHeader";

export default function IntroducePage() {
  return (
    <div>
      <ResetScrollBtn />
      <HomeHeader />
      <div className="mx-6 mt-32 flex flex-col items-center gap-40">
        <WelcomeSection />
        <FunctionSection />
        <UsecaseSection />
        <TeamSection />
      </div>
    </div>
  );
}
