
export interface RawTelemetryPositionData {
  msgId: number;
  timestamp: Date;
  payload: {
    lat: number;
    lon: number;
    alt: number;
  };
}
