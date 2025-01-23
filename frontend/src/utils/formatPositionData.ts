import { RawTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

const LAT_LON_DIVISOR = 1e7;
const ALT_DIVISOR = 1e3;

export default function formatPositionData(data: RawTelemetryPositionData) {
  const formattedPayload = {
    lat: data.payload.lat / LAT_LON_DIVISOR,
    lon: data.payload.lon / LAT_LON_DIVISOR,
    alt: data.payload.alt / ALT_DIVISOR,
  };
  return {
    ...data,
    payload: formattedPayload
  };
}