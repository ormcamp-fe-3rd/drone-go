import {
  RawTelemetryBatteryData,
  ProcessedTelemetryBatteryData,
} from "../types/telemetryBatteryDataTypes";

export const fetchTelemetriesByRobotAndOperation = async (
  robotId: string,
  operationId: string,
): Promise<ProcessedTelemetryBatteryData[]> => {
  if (!robotId || !operationId) {
    throw new Error("Both robotId and operationId are required");
  }

  const url = `http://localhost:3000/telemetries?robot=${encodeURIComponent(robotId)}&operation=${encodeURIComponent(operationId)}`;
  console.log("Fetching telemetries with URL:", url); // TODO: 배포 이후 제거

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch telemetries: ${response.statusText}`);
    }
    const data: RawTelemetryBatteryData[] = await response.json();

    // msgId가 147인 데이터만 필터링하고 필요한 값만 반환 - 배터리 온도, 전압, 잔량 데이터
    const filterBatteryData: ProcessedTelemetryBatteryData[] = data
      .filter((telemetry) => telemetry.msgId === 147)
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          temperature: telemetry.payload.temperature,
          batteryRemaining: telemetry.payload.batteryRemaining,
          voltage: telemetry.payload.voltages[0],
        },
      }));

    return filterBatteryData;
  } catch (error) {
    console.error("Error fetching telemetries:", error);
    throw error;
  }
};
