import {
  telemetryFilterConfig,
  TelemetryFilterConfigKey,
} from "./telemetryFilterConfig";
import { Telemetry } from "@/types/telemetryDataTypes";

export const filterTelemetryData = <T>(
  data: Telemetry[],
  pageKey: TelemetryFilterConfigKey,
): T[] => {
  const config = telemetryFilterConfig[pageKey];

  return data
    .filter((entry) => config?.[entry.msgId as keyof typeof config]) // ✅ msgId 접근 방식 수정
    .map((entry) => {
      // ✅ readonly 배열을 일반 배열로 변환
      const allowedKeys = [
        ...(config?.[entry.msgId as keyof typeof config] ?? []),
      ];

      return {
        timestamp: new Date(entry.timestamp),
        msgId: entry.msgId,
        payload: Object.fromEntries(
          allowedKeys
            .filter((key) => key in entry.payload)
            .map((key) => [key, entry.payload[key]]),
        ),
      };
    }) as T[];
};
