export interface Telemetry {
  _id: string;
  operation: string;
  robot: string;
  __v?: number;
  msgId: number;
  timestamp: Date | number;
  payload: TelemetryPayload;
}

// ✅ 텔레메트리 필드 취사 선택 (기본 필드 + 페이로드 전체)
export type TelemetrySubset<T extends keyof Telemetry> = Pick<Telemetry, T>;

export interface TelemetryPayload {
  airspeed?: number | null;
  groundspeed?: number | null;
  alt?: number | null;
  pitch?: number | null;
  pitchspeed?: number | null;
  roll?: number | null;
  rollspeed?: number | null;
  yaw?: number | null;
  yawspeed?: number | null;
  climb?: number | null;
  altEllipsoid?: number | null;
  batteryFunction?: number | null;
  batteryRemaining?: number | null;
  chargeState?: number | null;
  cog?: number | null;
  currentBattery?: number | null;
  currentConsumed?: number | null;
  energyConsumed?: number | null;
  eph?: number | null;
  epv?: number | null;
  faultBitmask?: number | null;
  fixType?: number | null;
  hAcc?: number | null;
  hdg?: number | null;
  hdgAcc?: number | null;
  heading?: number | null;
  id?: number | null;
  lat?: number | null;
  lon?: number | null;
  mode?: number | null;
  relativeAlt?: number | null;
  satellitesVisible?: number | null;
  temperature?: number | null;
  text?: string | null;
  throttle?: number | null;
  timeBootMs?: number | null;
  timeRemaining?: number | null;
  timeUsec?: number | null;
  vAcc?: number | null;
  vel?: number | null;
  velAcc?: number | null;
  vx?: number | null;
  vy?: number | null;
  vz?: number | null;
  voltages?: number[] | null;
  voltagesExt?: number[] | null;
  [key: string]: any | null; // 추가적인 동적 필드 지원
}
