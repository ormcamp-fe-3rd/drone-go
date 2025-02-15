import * as Cesium from "cesium";
import { Cartesian3 } from "cesium";
import { useEffect, useState } from "react";

import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import { formatTime } from "@/utils/formatTime";

interface PositionDataProp {
  positionData: FormattedTelemetryPositionData[] | null;
}

export const usePositionData = ({ positionData }: PositionDataProp) => {
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [startEndTime, setStartEndTime] = useState<{
    startTime: string;
    endTime: string;
  }>({ startTime: "", endTime: "" });
  const [flightStartTime, setFlightStartTime] = useState(0);
  const [pathPositions, setPathPositions] = useState<Cartesian3[]>();

  useEffect(() => {
    if (!positionData) return;

    const flightStart = positionData[0].timestamp;
    const flightEnd = positionData[positionData?.length - 1].timestamp;
    setFlightStartTime(flightStart);
    setStartEndTime({
      startTime: formatTime(new Date(flightStart)),
      endTime: formatTime(new Date(flightEnd)),
    });
    setTotalDuration((flightEnd - flightStart) / 1000);

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
    totalDuration,
    startEndTime,
    flightStartTime,
    pathPositions,
  };
};
