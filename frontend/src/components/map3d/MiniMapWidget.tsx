import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

import MiniMap from "./MiniMap";

interface MiniMapWidgetProp {
  positionData: FormattedTelemetryPositionData[] | null;
}
const MiniMapWidget = ({ positionData }: MiniMapWidgetProp) => {
  return (
    <div className="mx-6 my-0 hidden h-[27vh] w-[30vw] max-w-[17rem] rounded-[10px] bg-white bg-opacity-60 sm:grid">
      <MiniMap positionData={positionData} />
    </div>
  );
};

export default MiniMapWidget