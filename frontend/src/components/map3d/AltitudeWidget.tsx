import { useContext } from "react";

import { PhaseContext } from "@/contexts/PhaseContext";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

interface AltitudeWidgetProp{
  positionData: FormattedTelemetryPositionData[] | null;
}
const AltitudeWidget = ({positionData}:AltitudeWidgetProp) => {
  const { phase } = useContext(PhaseContext);
  const src = "/images/navigator-01.svg";

  const altitude = positionData
    ? positionData[Math.floor(phase * (positionData.length - 1))].payload.alt
    : 0; // phase 값에 따라 positionData의 고도 선택
    
  return (
    <div className="relative mx-6 mt-2 hidden h-[5vh] w-[30vw] max-w-[19rem] grid-cols-2 items-center rounded-[10px] bg-white bg-opacity-90 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_1.5fr]">
      <div className="flex items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={src} alt="Altitude" />
        <p className="pl-2">Altitude</p>
      </div>
      <div className="text-right">{altitude}m</div>
    </div>
  );
};

export default AltitudeWidget