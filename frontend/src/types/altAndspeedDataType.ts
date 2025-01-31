export interface AltAndSpeedData {
  msgId: number;
  timestamp: Date;
  payload: {
    groundspeed: number;
    alt: number;
  };
}
