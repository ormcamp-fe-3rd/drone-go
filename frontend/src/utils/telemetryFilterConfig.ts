export const telemetryFilterConfig = {
  "2D_MAP": {
    30: ["roll", "pitch", "yaw"],
    33: ["lat", "lon", "alt"],
    74: ["heading", "groundspeed"],
    147: ["batteryRemaining"],
    253: ["text"],
  },
} as const;

export type TelemetryFilterConfigKey = keyof typeof telemetryFilterConfig;