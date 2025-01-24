import { TelemetryPositionData } from "@/types/telemetryPositionDataTypes";


export const fetchPositionDataByOperation = async (
  robotId: string,
  operationId: string,
): Promise<TelemetryPositionData[]> => {
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
    const data: TelemetryPositionData[] = await response.json();

    const GLOBAL_POSITION_INT_ID = 33;

    const filterPositionData: TelemetryPositionData[] = data
      .filter((telemetry) => telemetry.msgId === GLOBAL_POSITION_INT_ID)
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
