import { TelemetryChartData } from "@/types/telemetryChartDataTypes";
import { MSG_ID } from "@/constants";

// Alt와 Speed 데이터를 합치는 함수
export const processAltAndSpeedData = (data: TelemetryChartData[]): { timestamp: Date; payload: { alt?: number; groundspeed?: number } }[] => {
  // 타임스탬프별로 데이터 정리
  const timestampMap = new Map<string, { timestamp: Date; payload: { alt?: number; groundspeed?: number } }>();

  data
    .filter(
      (telemetry) =>
        telemetry.msgId === MSG_ID.VFR_HUD || telemetry.msgId === MSG_ID.GLOBAL_POSITION,
    )
    .forEach((telemetry) => {
      const timestamp = new Date(telemetry.timestamp).toISOString();
      const existing = timestampMap.get(timestamp);

      if (existing) {
        if (telemetry.msgId === MSG_ID.VFR_HUD) {
          existing.payload.groundspeed = telemetry.payload.groundspeed;
        } else {
          existing.payload.alt = telemetry.payload.alt;
        }
      } else {
        timestampMap.set(timestamp, {
          timestamp: new Date(telemetry.timestamp),
          payload: {
            groundspeed:
              telemetry.msgId === MSG_ID.VFR_HUD
                ? telemetry.payload.groundspeed
                : undefined,
            alt:
              telemetry.msgId === MSG_ID.GLOBAL_POSITION
                ? telemetry.payload.alt
                : undefined,
          },
        });
      }
    });

  // 시간순으로 정렬된 배열로 변환
  const sortedData = Array.from(timestampMap.values()).sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  // 선형 보간 함수
  const interpolateValue = (value1: number, value2: number, ratio: number): number => {
    return value1 + (value2 - value1) * ratio;
  };

  // 데이터 보간 처리
  const interpolatedData: { timestamp: Date; payload: { alt?: number; groundspeed?: number } }[] = [];

  for (let i = 0; i < sortedData.length; i++) {
    const current = sortedData[i];
    interpolatedData.push({ ...current }); // 현재 데이터 추가

    // groundspeed 보간
    if (current.payload.groundspeed === undefined) {
      let prevIndex = i - 1;
      let nextIndex = i + 1;

      // 이전 값 찾기
      while (
        prevIndex >= 0 &&
        sortedData[prevIndex].payload.groundspeed === undefined
      ) {
        prevIndex--;
      }

      // 다음 값 찾기
      while (
        nextIndex < sortedData.length &&
        sortedData[nextIndex].payload.groundspeed === undefined
      ) {
        nextIndex++;
      }

      // 이전과 다음 값이 모두 존재하면 보간
      if (prevIndex >= 0 && nextIndex < sortedData.length) {
        const prevValue = sortedData[prevIndex].payload.groundspeed!;
        const nextValue = sortedData[nextIndex].payload.groundspeed!;
        const timeRange =
          sortedData[nextIndex].timestamp.getTime() - sortedData[prevIndex].timestamp.getTime();
        const timeFromPrev =
          current.timestamp.getTime() - sortedData[prevIndex].timestamp.getTime();
        const ratio = timeFromPrev / timeRange;

        interpolatedData[i].payload.groundspeed = interpolateValue(
          prevValue,
          nextValue,
          ratio,
        );
      }
    }

    // altitude 보간
    if (current.payload.alt === undefined) {
      let prevIndex = i - 1;
      let nextIndex = i + 1;

      // 이전 값 찾기
      while (
        prevIndex >= 0 &&
        sortedData[prevIndex].payload.alt === undefined
      ) {
        prevIndex--;
      }

      // 다음 값 찾기
      while (
        nextIndex < sortedData.length &&
        sortedData[nextIndex].payload.alt === undefined
      ) {
        nextIndex++;
      }

      // 이전과 다음 값이 모두 존재하면 보간
      if (prevIndex >= 0 && nextIndex < sortedData.length) {
        const prevValue = sortedData[prevIndex].payload.alt!;
        const nextValue = sortedData[nextIndex].payload.alt!;
        const timeRange =
          sortedData[nextIndex].timestamp.getTime() - sortedData[prevIndex].timestamp.getTime();
        const timeFromPrev =
          current.timestamp.getTime() - sortedData[prevIndex].timestamp.getTime();
        const ratio = timeFromPrev / timeRange;

        interpolatedData[i].payload.alt = interpolateValue(prevValue, nextValue, ratio);
      }
    }
  }

  // undefined 값을 가장 가까운 실제 값으로 채우기
  return interpolatedData.map((data) => ({
    timestamp: data.timestamp,
    payload: {
      groundspeed:
        data.payload.groundspeed ??
        findNearestValue(interpolatedData, data.timestamp, "groundspeed"),
      alt:
        data.payload.alt ??
        findNearestValue(interpolatedData, data.timestamp, "alt"),
    },
  }));
};

// 가장 가까운 값 찾기 헬퍼 함수
const findNearestValue = (
  data: { timestamp: Date; payload: { alt?: number; groundspeed?: number } }[],
  timestamp: Date,
  key: "groundspeed" | "alt",
): number => {
  const targetTime = timestamp.getTime();
  let nearestValue = 0;
  let minTimeDiff = Infinity;

  for (const item of data) {
    if (item.payload[key] !== undefined) {
      const timeDiff = Math.abs(item.timestamp.getTime() - targetTime);
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        nearestValue = item.payload[key]!;
      }
    }
  }

  return nearestValue;
};