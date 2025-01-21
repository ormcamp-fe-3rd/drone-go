import { RawTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

export default function formatPositionData(data: RawTelemetryPositionData) {
  const formattedPayload = {
    lat: data.payload.lat / Math.pow(10, 7),
    lon: data.payload.lon / Math.pow(10, 7),
    alt: data.payload.alt / Math.pow(10, 3)
  };
  return {
    ...data,
    payload: formattedPayload
  };
}