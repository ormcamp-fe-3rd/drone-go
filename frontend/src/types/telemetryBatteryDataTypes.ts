//데이터 받아올 때 타입
export interface RawTelemetryBatteryData {
  msgId: number;
  timestamp: string;
  payload: {
    temperature: number;
    batteryRemaining: number;
    voltages: number[]; //원래 데이터에서 voltages는 배열
  };
}
//가공 후 데이터 타입
export interface ProcessedTelemetryBatteryData {
  msgId: number;
  timestamp: Date; // Date 객체로 처리
  payload: {
    temperature: number;
    batteryRemaining: number;
    voltage: number;
  };
}
