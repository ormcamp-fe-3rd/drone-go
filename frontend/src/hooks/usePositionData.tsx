import * as Cesium from "cesium";
import { Cartesian3 } from "cesium";
import { useEffect, useState } from "react";

import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

interface PositionDataProp {
  positionData: FormattedTelemetryPositionData[] | null;
}

export const usePositionData = ({ positionData }: PositionDataProp) => {
  const [pathPositions, setPathPositions] = useState<Cartesian3[]>();

  useEffect(() => {
    if (!positionData) return;

    // 경로 라인 계산
    const pathPositions = positionData.map((item) =>
      Cesium.Cartesian3.fromDegrees(
        item.payload.lon,
        item.payload.lat,
        item.payload.alt,
      ),
    );
    setPathPositions(pathPositions);
  }, [positionData]);

  return {
    pathPositions,
  };
};
