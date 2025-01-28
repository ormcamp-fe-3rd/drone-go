import { LatLonAlt } from "@/types/latLonAlt";
import { TelemetryPositionData } from "@/types/telemetryPositionDataTypes";


export const fetchPositionDataByOperation = async (
  robotId: string,
  operationId: string,
): Promise<LatLonAlt[]> => {
  if (!robotId || !operationId) {
    throw new Error("OperationId are required");
  }

  const url = `http://localhost:3000/telemetries?robot=${encodeURIComponent(robotId)}&operation=${encodeURIComponent(operationId)}`;
  console.log("Fetching telemetries with URL:", url); // TODO: 배포 이후 제거

  const token = localStorage.getItem("token")
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(url,{headers});
    if (!response.ok) {
      if (response.status === 401) {
        // 로그인 토큰이 유효하지 않음
        throw new Error("Unauthorized user");
      }
      throw new Error(`Failed to fetch telemetries: ${response.statusText}`);
    }
    const data: TelemetryPositionData[] = await response.json();

    // msgId가 33인 데이터만 필터링하고 필요한 값만 반환 - 경도, 위도, 고도

    // TODO: 위도,경도,고도 데이터만 먼저 연결, 추후 전체 데이터 연결
    // const filterPositionData: TelemetryPositionData[] = data
    const filterPositionData: LatLonAlt[] = data
      .filter((telemetry) => telemetry.msgId === 33)
      .map((telemetry) => ({
        // msgId: telemetry.msgId,
        // timestamp: new Date(telemetry.timestamp),
        // payload: {
        //   lat: telemetry.payload.lat,
        //   lon: telemetry.payload.lon,
        //   alt: telemetry.payload.alt,
        // },

        lat: telemetry.payload.lat,
        lon: telemetry.payload.lon,
        alt: telemetry.payload.alt,
      }));
    return filterPositionData;
  } catch (error) {
    console.error("Error fetching telemetries:", error);
    throw error;
  }
};
