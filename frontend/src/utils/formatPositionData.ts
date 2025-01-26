// utils/formatPositionData.ts
import { TelemetryPositionData } from "@/types/telemetryPositionDataTypes";

const LAT_LON_DIVISOR = 1e7;
const ALT_DIVISOR = 1e3;

export default function formatPositionData(data: TelemetryPositionData) {
  // 위도, 경도, 고도 데이터만 포맷팅
  const formattedPayload = {
    lat: data.payload.lat / LAT_LON_DIVISOR,
    lon: data.payload.lon / LAT_LON_DIVISOR,
    alt: data.payload.alt / ALT_DIVISOR,
  };

  return {
    ...data,
    payload: formattedPayload,
  };
}
