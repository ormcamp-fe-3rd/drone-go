
export interface TelemetryPositionData {
  msgId: number;
  timestamp: Date;
  payload: {
    lat: number;
    lon: number;
    alt: number;
  };
}
