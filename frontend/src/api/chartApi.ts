import { TelemetryData } from "../types/telemetryAllDataTypes";
import { ProcessedTelemetryBatteryData } from "../types/telemetryBatteryDataTypes";
import { ProcessedTelemetrySatellitesData } from "../types/telemetrySatellitesDataTypes";
import { ProcessedTelemetryTextData } from "../types/telemetryTextData";
import { AltAndSpeedData } from "@/types/altAndspeedDataType";


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
    const response = await fetch(url, {headers});
    if (!response.ok) {
      if(response.status === 401){
        // 로그인 토큰이 유효하지 않음
        throw new Error("Unauthorized user")
      }
      throw new Error(`Failed to fetch telemetries: ${response.statusText}`);
    }
    const data: TelemetryData[] = await response.json();

    // msgId가 147인 데이터만 필터링하고 필요한 값만 반환 - 배터리 온도, 전압, 잔량 데이터
    const BATTERY_STATUS_MSG_ID = 147;
    const batteryData: ProcessedTelemetryBatteryData[] = data
      .filter((telemetry) => telemetry.msgId === BATTERY_STATUS_MSG_ID)
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
    const TEXT_STATUS_MSG_ID = 253;
    const textData: ProcessedTelemetryTextData[] = data
      .filter((telemetry) => telemetry.msgId === TEXT_STATUS_MSG_ID)
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          text: telemetry.payload.text, // text 속성 추출
        },
      }));

    // msgId가 24인 데이터만 필터링하고 필요한 값만 반환 - 연결되어있는 위성 수
    const GPS_RAW_INT_MSG_ID = 24;
    const satellitesData: ProcessedTelemetrySatellitesData[] = data
      .filter((telemetry) => telemetry.msgId === GPS_RAW_INT_MSG_ID)
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          satellitesVisible: telemetry.payload.satellitesVisible, // text 속성 추출
        },
      }));

    // msgId가 74(groundspeed: 속도), 33(alt: 고도) 인 데이터만 필터링하고 필요한 값만 반환
    const GROUNDSPEED_MSG_ID = 74; // msgId: 74
    const ALTITUDE_MSG_ID = 33; // msgId: 33

    const altAndSpeedData: AltAndSpeedData[] = data
      .filter(
        (telemetry) =>
          telemetry.msgId === GROUNDSPEED_MSG_ID ||
          telemetry.msgId === ALTITUDE_MSG_ID,
      )
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          groundspeed: telemetry.payload.groundspeed, // groundspeed 추가
          alt: telemetry.payload.alt, // alt 추가
        },
      }));

    return { batteryData, textData, satellitesData, altAndSpeedData };
  } catch (error) {
    console.error("Error fetching telemetries:", error);
    throw error;
  }
};
