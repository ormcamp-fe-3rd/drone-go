import { useContext } from "react";

import { PhaseContext } from "@/contexts/PhaseContext";
import { formatAndSortPositionData } from "@/utils/formatPositionData";

interface AltitudeWidgetProps {
  positionData: ReturnType<typeof formatAndSortPositionData> | null;
}

const AltitudeWidget = ({ positionData }: AltitudeWidgetProps) => {
  const { phase } = useContext(PhaseContext);
  const src = "/images/navigator-01.svg";

  // positionData가 없거나 phase 계산 결과가 유효하지 않을 경우 기본값 처리
  const altitude =
    positionData && positionData.length > 0
      ? positionData[Math.min(Math.floor(phase * (positionData.length - 1)), positionData.length - 1)]
          .payload.alt ?? 0 // null 또는 undefined 방지
      : 0;

  return (
    <div className="relative mx-6 mt-2 hidden h-[5vh] w-[30vw] max-w-[17rem] grid-cols-2 items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_1.5fr]">
      <div className="flex items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={src} alt="Altitude" />
        <p className="pl-2">Altitude</p>
      </div>
      <div className="text-right">{altitude}m</div>
    </div>
  );
};

export default AltitudeWidget;
