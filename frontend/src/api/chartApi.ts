import { MSG_ID } from "@/constants";
import { AltAndSpeedData } from "@/types/altAndspeedDataType";

import { TelemetryData } from "../types/telemetryAllDataTypes";
import { ProcessedTelemetryBatteryData } from "../types/telemetryBatteryDataTypes";
import { ProcessedTelemetrySatellitesData } from "../types/telemetrySatellitesDataTypes";
import { ProcessedTelemetryTextData } from "../types/telemetryTextData";

export const fetchTelemetriesByRobotAndOperation = async (
  robotId: string,
  operationId: string,
): Promise<{
  batteryData: ProcessedTelemetryBatteryData[];
  textData: ProcessedTelemetryTextData[];
  satellitesData: ProcessedTelemetrySatellitesData[];
  altAndSpeedData: AltAndSpeedData[];
}> => {
  if (!robotId || !operationId) {
    throw new Error("Both robotId and operationId are required");
  }

  const url = `http://localhost:3000/telemetries?robot=${encodeURIComponent(robotId)}&operation=${encodeURIComponent(operationId)}`;
  console.log("Fetching telemetries with URL:", url); // TODO: 배포 이후 제거

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.log("Response Status:", response.status);
      console.log("Response Status Text:", response.statusText);
      if (response.status === 401) {
        // 로그인 토큰이 유효하지 않음
        localStorage.removeItem("token");
        alert("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
        throw new Error("Unauthorized user")
      }
      const errorBody = await response.text();
      console.log("Error Body:", errorBody);
      throw new Error(`Failed to fetch telemetries: ${response.statusText}`);
    }
    const data: TelemetryData[] = await response.json();

    // msgId가 147인 데이터만 필터링하고 필요한 값만 반환 - 배터리 온도, 전압, 잔량 데이터
    const batteryData: ProcessedTelemetryBatteryData[] = data
      .filter((telemetry) => telemetry.msgId === MSG_ID.BATTERY_STATUS)
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          temperature: telemetry.payload.temperature,
          batteryRemaining: telemetry.payload.batteryRemaining,
          voltage: telemetry.payload.voltages[0],
        },
      }));

    // msgId가 253인 데이터만 필터링하고 필요한 값만 반환 - text 상태 데이터
    const textData: ProcessedTelemetryTextData[] = data
      .filter((telemetry) => telemetry.msgId === MSG_ID.STATUSTEXT)
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          text: telemetry.payload.text, // text 속성 추출
        },
      }));

    // msgId가 24인 데이터만 필터링하고 필요한 값만 반환 - 연결되어있는 위성 수
    const satellitesData: ProcessedTelemetrySatellitesData[] = data
      .filter((telemetry) => telemetry.msgId === MSG_ID.GPS_RAW_INT)
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          satellitesVisible: telemetry.payload.satellitesVisible, // text 속성 추출
        },
      }));

    // msgId가 74(groundspeed: 속도), 33(alt: 고도) 인 데이터만 필터링하고 필요한 값만 반환
    const processAltAndSpeedData = (data: any[]): AltAndSpeedData[] => {

      // 타임스탬프별로 데이터 정리
      const timestampMap = new Map<string, AltAndSpeedData>();

      data
        .filter(
          (telemetry) =>
            telemetry.msgId === MSG_ID.VFR_HUD ||
            telemetry.msgId === MSG_ID.GLOBAL_POSITION,
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
      const interpolateValue = (
        value1: number,
        value2: number,
        ratio: number,
      ): number => {
        return value1 + (value2 - value1) * ratio;
      };

      // 데이터 보간 처리
      const interpolatedData: AltAndSpeedData[] = [];

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
              sortedData[nextIndex].timestamp.getTime() -
              sortedData[prevIndex].timestamp.getTime();
            const timeFromPrev =
              current.timestamp.getTime() -
              sortedData[prevIndex].timestamp.getTime();
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
              sortedData[nextIndex].timestamp.getTime() -
              sortedData[prevIndex].timestamp.getTime();
            const timeFromPrev =
              current.timestamp.getTime() -
              sortedData[prevIndex].timestamp.getTime();
            const ratio = timeFromPrev / timeRange;

            interpolatedData[i].payload.alt = interpolateValue(
              prevValue,
              nextValue,
              ratio,
            );
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
      data: AltAndSpeedData[],
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

    return {
      batteryData,
      textData,
      satellitesData,
      altAndSpeedData: processAltAndSpeedData(data),
    };
  } catch (error) {
    console.error("Error fetching telemetries:", error);
    throw error;
  }
};
