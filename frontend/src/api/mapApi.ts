import { RawTelemetryPositionData } from "@/types/telemetryPositionDataTypes";


export const fetchPositionDataByOperation = async (
  robotId: string,
  operationId: string,
): Promise<RawTelemetryPositionData[]> => {
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
    const data: RawTelemetryPositionData[] = await response.json();

    // msgId가 33인 데이터만 필터링하고 필요한 값만 반환 - 경도, 위도, 고도
    const filterPositionData: RawTelemetryPositionData[] = data
      .filter((telemetry) => telemetry.msgId === 33)
      .map((telemetry) => ({
        msgId: telemetry.msgId,
        timestamp: new Date(telemetry.timestamp),
        payload: {
          lat: telemetry.payload.lat,
          lon: telemetry.payload.lon,
          alt: telemetry.payload.alt,
        },
      }));

    return filterPositionData;
  } catch (error) {
    console.error("Error fetching telemetries:", error);
    throw error;
  }
};
