export interface TelemetryAttitudeData {
  msgId: number;
  timestamp: Date;
  payload: {
    roll: number;
    pitch: number;
    yaw: number;
    timeBootMs?: number;
  };
}
