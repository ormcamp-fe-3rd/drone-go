import { ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function ResetScrollBtn() {
  const resetScroll = () => {
    gsap.to(window, { scrollTo: { y: 0 }, duration: 0.8, ease: "power2.out" }); // GSAP 스크롤 애니메이션 적용
  };

  return (
    <button
      onClick={resetScroll}
      className="fixed bottom-2 right-10 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white"
    >
      <ArrowUp size={24} />
    </button>
  );
}
