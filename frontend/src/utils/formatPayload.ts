import { format } from "date-fns-tz";
import { Telemetry } from "@/api/generatedClient";

const LAT_LON_DIVISOR = 1e7;
const ALT_DIVISOR = 1e3;

// timestamp -> HH:mm:ss 변환 (숫자 입력 지원)
export const formatNumberTime = (timestamp?: number): string => {
  if (!timestamp) return "00:00:00";
  const date = new Date(timestamp);
  return format(date, "HH:mm:ss", { timeZone: "Asia/Seoul" });
};

// ✅ 안전한 값 변환 함수
const extractValue = (value: unknown, divisor = 1): number | null => {
  return typeof value === "number" ? value / divisor : null;
};

// ✅ Telemetry 데이터 가공 함수
export default function formatPayload(data: Telemetry | null) {
  if (!data?.timestamp || !data?.msgId || !data?.payload) {
    console.warn("⚠️ 유효하지 않은 데이터:", data);
    return null;
  }

  const { msgId, payload } = data;
  const timestamp = new Date(data.timestamp).getTime(); // ISO -> timestamp 변환

  return {
    msgId,
    timestamp,
    formattedTime: formatNumberTime(timestamp),
    lat: extractValue(payload.lat, LAT_LON_DIVISOR),
    lon: extractValue(payload.lon, LAT_LON_DIVISOR),
    alt: extractValue(payload.alt, ALT_DIVISOR),
    roll: typeof payload.roll === "number" ? payload.roll : null,
    pitch: typeof payload.pitch === "number" ? payload.pitch : null,
    yaw: typeof payload.yaw === "number" ? payload.yaw : null,
    heading: typeof payload.heading === "number" ? payload.heading : null,
    groundspeed: typeof payload.groundspeed === "number" ? payload.groundspeed : null,
    batteryRemaining: typeof payload.batteryRemaining === "number" ? payload.batteryRemaining : null,
    text: typeof payload.text === "string" ? payload.text : "",
  };
}
