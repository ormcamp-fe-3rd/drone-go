import { TelemetryAttitudeData } from "@/types/telemetryAttitudeDataTypes";


export const fetchAttitudeDataByRobotAndOperation = async (
  robotId: string,
  operationId: string,
): Promise<TelemetryAttitudeData[]> => {
  if (!robotId || !operationId) {
    throw new Error("OperationId are required");
  }

  const url = `http://localhost:3000/telemetries?robot=${encodeURIComponent(robotId)}&operation=${encodeURIComponent(operationId)}`;
  console.log("Fetching telemetries with URL:", url); // TODO: 배포 이후 제거

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch telemetries: ${response.statusText}`);
    }
    const data: TelemetryAttitudeData[] = await response.json();

    // msgId가 30인 데이터만 필터링하고 필요한 값만 반환 - roll, pitch, yaw
    const filterAttitudeData: TelemetryAttitudeData[] = data
      .filter((telemetry) => telemetry.msgId === 30)
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          roll: telemetry.payload.roll,
          pitch: telemetry.payload.pitch,
          yaw: telemetry.payload.yaw,
        },
      }));

    return filterAttitudeData;
  } catch (error) {
    console.error("Error fetching telemetries:", error);
    throw error;
  }
};