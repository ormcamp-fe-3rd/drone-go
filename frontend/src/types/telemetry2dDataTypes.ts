// 📌 2D 페이지 전용 타입 (필요한 필드만 정의)
export interface Telemetry2dData {
  msgId: number;
  timestamp: Date;
  payload: {
    roll: number;
    pitch: number;
    yaw: number;
    lat: number;
    lon: number;
    alt: number;
    heading: number;
    groundspeed: number;
    batteryRemaining: number;
    text: string;
  };
}