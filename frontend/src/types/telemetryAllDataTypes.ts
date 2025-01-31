export interface TelemetryData {
  msgId: number;
  timestamp: Date;
  payload: {
    temperature: number;
    batteryRemaining: number;
    voltages: number[]; //원래 데이터에서 voltages는 배열
    text: string;
    satellitesVisible: number;
    groundspeed: number;
    alt: number;
  };
}
