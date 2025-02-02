import { Telemetry, type TelemetrySubset } from "./telemetryDataTypes";

// 📌 2D 전용 텔레메트리 데이터 구조 정의
export interface Telemetry2dData extends Omit<Telemetry, "payload"> {
  payload: {
    roll: number | null;
    pitch: number | null;
    yaw: number | null;
    lat: number | null;
    lon: number | null;
    alt: number | null;
    heading: number | null;
    groundspeed: number | null;
    batteryRemaining: number | null;
    text: string | null;
  };
}

// ✅ 🔥 텔레메트리 필드 선택 유틸 (export type 사용!)
export type { TelemetrySubset };

// ✅ 🔥 payload 내부 필드만 선택하는 유틸 추가!
export type Telemetry2dPayloadSubset<T extends keyof Telemetry2dData["payload"]> = Pick<
  Telemetry2dData["payload"],
  T
>;