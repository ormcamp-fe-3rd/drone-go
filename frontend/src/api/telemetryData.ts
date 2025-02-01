import { useQuery } from "@tanstack/react-query";
import { getDroneTelemetryAPI, GetTelemetriesResult } from "@/api/generatedClient";
import formatPayload from "@/utils/formatPayload";

// ✅ msgId별 필요한 필드 매핑
const MSG_ID_FIELDS = {
  33: ["lat", "lon", "alt"], // 위치 데이터
  30: ["roll", "pitch", "yaw"], // 자세 데이터
  74: ["heading", "groundspeed"], // 속도 데이터
  147: ["batteryRemaining"], // 배터리 상태
  253: ["text"], // 메시지 데이터
} as const;

type MsgIdKeys = keyof typeof MSG_ID_FIELDS;

const filterTelemetryByMsgId = (data: GetTelemetriesResult | null, msgId: MsgIdKeys) => {
  if (!data) return [];

  return data
    .map(formatPayload)
    .filter((formatted): formatted is NonNullable<ReturnType<typeof formatPayload>> => formatted !== null)
    .filter((formatted) => formatted.msgId === msgId)
    .map((formatted) => {
      const filteredPayload: Record<string, any> = {};

      MSG_ID_FIELDS[msgId].forEach((field) => {
        const value = formatted[field as keyof typeof formatted] ?? undefined;
        if (value !== undefined) {
          filteredPayload[field] = value;
        }
      });

      return { ...formatted, ...filteredPayload };
    });
};

// ✅ msgId별 데이터 그룹화
const filterTelemetryData = (data: GetTelemetriesResult | null) => {
  if (!data) return { position: [], orientation: [], speed: [], battery: [], text: [] };

  return {
    position: filterTelemetryByMsgId(data, 33),
    orientation: filterTelemetryByMsgId(data, 30),
    speed: filterTelemetryByMsgId(data, 74),
    battery: filterTelemetryByMsgId(data, 147),
    text: filterTelemetryByMsgId(data, 253),
  };
};

// ✅ React Query를 통한 데이터 요청 훅
export const useTelemetryData = (robot: string, operation: string) => {
  return useQuery({
    queryKey: ["telemetryData", robot, operation],
    queryFn: async () => {
      if (!robot || !operation) return { position: [], orientation: [], speed: [], battery: [], text: [] };
      const response = await getDroneTelemetryAPI().getTelemetries({ robot, operation });
      return filterTelemetryData(response);
    },
    enabled: !!robot && !!operation,
  });
};
