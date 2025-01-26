// utils/formatPositionData.ts (디버깅 로그 추가)
import { TelemetryPositionData } from "@/types/telemetryPositionDataTypes";

const LAT_LON_DIVISOR = 1e7;  // 위도, 경도에 대한 나누기 값
const ALT_DIVISOR = 1e3;      // 고도에 대한 나누기 값

export default function formatPositionData(data: TelemetryPositionData) {
  const formattedPayload = {
    lat: data.payload.lat / LAT_LON_DIVISOR,  // 위도
    lon: data.payload.lon / LAT_LON_DIVISOR,  // 경도
    alt: data.payload.alt / ALT_DIVISOR,      // 고도
  };

  console.log("Formatted Payload:", formattedPayload);  // 포맷팅된 데이터 출력

  return {
    ...data,
    payload: formattedPayload,
  };
}
