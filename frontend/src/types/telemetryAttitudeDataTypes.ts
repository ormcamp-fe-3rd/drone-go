export interface TelemetryAttitudeData {
    msgId: number;
    timestamp: Date;
    payload: {
      roll: number;
      pitch: number;
      timeBootMs?: number;
    };
  }