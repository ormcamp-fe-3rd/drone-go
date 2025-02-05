export interface Telemetry {
  _id: string;
  operation: string;
  robot: string;
  __v?: number;
  msgId: number;
  timestamp: Date;
  payload: TelemetryPayload;
}

// 전체 payload 타입
export interface TelemetryPayload {
  airspeed?: number;
  groundspeed?: number;
  alt?: number;
  pitch?: number;
  pitchspeed?: number;
  roll?: number;
  rollspeed?: number;
  yaw?: number;
  yawspeed?: number;
  climb?: number;
  altEllipsoid?: number;
  batteryFunction?: number;
  batteryRemaining?: number;
  chargeState?: number;
  cog?: number;
  currentBattery?: number;
  currentConsumed?: number;
  energyConsumed?: number;
  eph?: number;
  epv?: number;
  faultBitmask?: number;
  fixType?: number;
  hAcc?: number;
  hdg?: number;
  hdgAcc?: number;
  heading?: number;
  id?: number;
  lat?: number;
  lon?: number;
  mode?: number;
  relativeAlt?: number;
  satellitesVisible?: number;
  temperature?: number;
  text?: string;
  throttle?: number;
  timeBootMs?: number;
  timeRemaining?: number;
  timeUsec?: number;
  vAcc?: number;
  vel?: number;
  velAcc?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  voltages?: number[];
  voltagesExt?: number[];
  [key: string]: any; // 추가적인 동적 필드 지원
}
