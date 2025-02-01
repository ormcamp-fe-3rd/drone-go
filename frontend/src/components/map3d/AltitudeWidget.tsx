import { useContext } from "react";
import { PhaseContext } from "@/contexts/PhaseContext";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

interface AltitudeWidgetProp {
  positionData: FormattedTelemetryPositionData[] | null;
}

const AltitudeWidget = ({ positionData }: AltitudeWidgetProp) => {
  const { phase } = useContext(PhaseContext);
  const src = "/images/navigator-01.svg";

  console.log("📌 AltitudeWidget - positionData:", positionData);

  const altitude =
    positionData && positionData.length > 0
      ? positionData[Math.floor(phase * (positionData.length - 1))]?.payload?.alt ?? 0
      : 0;

  console.log("📌 AltitudeWidget - Calculated Altitude:", altitude);

  return (
    <div className="relative mx-6 mt-2 grid h-[5vh] w-[20vw] grid-cols-[1fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold">
      <div className="flex items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={src} alt="Altitude" />
        <p className="pl-2">Altitude</p>
      </div>
      <div className="text-right">{altitude}m</div>
    </div>
  );
};

export default AltitudeWidget;
