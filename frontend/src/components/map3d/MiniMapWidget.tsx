import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

import MiniMap from "./MiniMap";

interface MiniMapWidgetProp {
  positionData: FormattedTelemetryPositionData[] | null;
}
const MiniMapWidget = ({ positionData }: MiniMapWidgetProp) => {
  return (
    <div className="toolbar-attitude mx-6 my-0 grid h-[27vh] w-[20vw] rounded-[10px] bg-white bg-opacity-60">
      <MiniMap positionData={positionData} />
    </div>
  );
};

export default MiniMapWidget