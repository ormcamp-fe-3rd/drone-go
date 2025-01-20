export interface ProcessedTelemetryBatteryData {
  msgId: number;
  timestamp: Date; // Date 객체로 처리
  payload: {
    temperature: number;
    batteryRemaining: number;
    voltage: number;
  };
}
