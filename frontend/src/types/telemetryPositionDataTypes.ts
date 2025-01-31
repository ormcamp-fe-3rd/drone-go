export interface TelemetryPositionData {
  msgId: number;
  timestamp: Date;
  payload: {
    lat: number;
    lon: number;
    alt: number;
  };
}

export interface FormattedTelemetryPositionData {
  msgId: number;
  timestamp: number;
  payload: {
    lat: number;
    lon: number;
    alt: number;
  };
}