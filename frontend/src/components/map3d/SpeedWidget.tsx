import { useContext } from "react";
import { PhaseContext } from "@/contexts/PhaseContext";

interface SpeedWidgetProps {
  speedData: {
    payload: {
      groundspeed: number
    }
  }[] | null;
}

const SpeedWidget = ({ speedData }: SpeedWidgetProps) => {
  const { phase } = useContext(PhaseContext);
  const src = "/public/images/rocket-01.svg";

  // 속도 변환 함수 (knots → m/s 변환)
  const convertSpeed = (knots: number) => knots * 0.514444;

  const speed = speedData
    ? convertSpeed(speedData[Math.floor(phase * (speedData.length - 1))].payload.groundspeed)
    : 0; // phase 값에 따라 speedData의 속도 선택

  return (
    <div className="relative mx-6 mt-2 hidden h-[5vh] w-[30vw] max-w-[17rem] grid-cols-2 items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_1.5fr]">
      <div className="flex items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={src} alt="Speed" />
        <p className="pl-2">Speed</p>
      </div>
      <div className="text-right">{speed.toFixed(2)}m/s</div>
    </div>
  );
};

export default SpeedWidget