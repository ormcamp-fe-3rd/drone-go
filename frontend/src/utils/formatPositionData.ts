import { TelemetrySubset } from "@/types/telemetry2dDataTypes";

const LAT_LON_DIVISOR = 1e7;
const ALT_DIVISOR = 1e3;

export default function formatPositionData(data: TelemetrySubset<"msgId" | "timestamp" | "payload">) {
  const formattedPayload = {
    lat: data.payload.lat ? data.payload.lat / LAT_LON_DIVISOR : null,
    lon: data.payload.lon ? data.payload.lon / LAT_LON_DIVISOR : null,
    alt: data.payload.alt ? data.payload.alt / ALT_DIVISOR : null,
  };

  return {
    msgId: data.msgId,
    timestamp: data.timestamp,
    payload: formattedPayload,
  };
}

export function formatAndSortPositionData(dataArray: TelemetrySubset<"msgId" | "timestamp" | "payload">[]) {
  return dataArray
    .map((data) => ({
      msgId: data.msgId,
      timestamp: new Date(data.timestamp).getTime(), // 2025-01-03T02:14:01.233Z -> 1735870439152
      payload: {
        lat: data.payload.lat ? data.payload.lat / LAT_LON_DIVISOR : null,
        lon: data.payload.lon ? data.payload.lon / LAT_LON_DIVISOR : null,
        alt: data.payload.alt ? data.payload.alt / ALT_DIVISOR : null,
      },
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}
