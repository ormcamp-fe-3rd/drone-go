import { telemetryFilterConfig, TelemetryFilterConfigKey } from "./telemetryFilterConfig";
import { Telemetry } from "@/types/telemetryDataTypes";

export const filterTelemetryData = <T>(data: Telemetry[], pageKey: TelemetryFilterConfigKey): T[] => {
  const config = telemetryFilterConfig[pageKey];

  return data
    .filter((entry) => config && config[entry.msgId as keyof typeof config])
    .map((entry) => ({
      _id: entry._id,
      operation: entry.operation,
      robot: entry.robot,
      timestamp: new Date(entry.timestamp),
      msgId: entry.msgId,
      payload: config
        ? config[entry.msgId as keyof typeof config].reduce<Record<string, any>>((acc, key: string) => {
            if (entry.payload[key] !== undefined) {
              acc[key] = entry.payload[key];
            }
            return acc;
          }, {})
        : {}
    })) as T[]; // ✅ 제네릭 타입으로 변경하여 차트 데이터도 대응 가능하게 함
};
