import { useQuery } from "@tanstack/react-query";
import { fetchTelemetryData } from "@/api/telemetryDataFetcher";
import { filterTelemetryData } from "@/utils/telemetryFilterUtils";
import { Telemetry2dData } from "@/types/telemetry2dDataTypes";
import { Robot } from "@/types/selectOptionsTypes";

type OperationInfo = {
  operationId: string;
  date: string;
  name: string;
};

export const useTelemetry2D = (
  selectedDrone: Robot | null,
  selectedOperationAndDate: OperationInfo | null
) => {
  return useQuery<Telemetry2dData[]>({
    queryKey: ["telemetry2D", selectedDrone, selectedOperationAndDate], // ✅ 객체를 직접 전달 (변경 감지 정확도 ↑)
    queryFn: async () => {
      if (!selectedDrone || !selectedOperationAndDate) {
        console.warn("⚠️ 드론 또는 오퍼레이션이 선택되지 않음. 빈 배열 반환");
        return [];
      }

      console.log("📌 사용 중인 robotId:", selectedDrone._id);
      console.log("📌 사용 중인 operationId:", selectedOperationAndDate.operationId);

      console.log("🚀 fetchTelemetryData 실행:", {
        droneId: selectedDrone._id,
        operationId: selectedOperationAndDate.operationId,
      });

      const data = (await fetchTelemetryData(
        selectedOperationAndDate.operationId,
        selectedDrone._id
      )) || [];

      console.log("📌 fetchTelemetryData 반환값:", data);
      console.log(
        "📌 데이터 타입:",
        typeof data,
        Array.isArray(data) ? "✅ 배열" : "❌ 배열 아님"
      );

      if (data.length === 0) {
        console.warn("⚠️ 가져온 텔레메트리 데이터가 없음. 빈 배열 반환");
      }

      return filterTelemetryData(data, "2D_MAP");
    },
    enabled: !!selectedDrone && !!selectedOperationAndDate,
    staleTime: 1000 * 60 * 5, // 5분 캐싱 (필요하면 조정 가능)
    retry: false, // ✅ 데이터가 없을 때 불필요한 재시도를 방지
  });
};
