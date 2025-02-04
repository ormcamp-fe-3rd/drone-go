import { useQuery } from "@tanstack/react-query";
import { fetchTelemetryData } from "@/api/telemetryDataFetcher";
import { filterTelemetryData } from "@/utils/telemetryFilterUtils";
import { Telemetry2dData } from "@/types/telemetry2dDataTypes";
import { Robot } from "@/types/selectOptionsTypes";

type OperationInfo = {
  operationId: string;
  timestamp: string;
  name: string;
};

export const useTelemetry2D = (
  selectedDrone: Robot | null,
  selectedOperationAndDate: OperationInfo | null
) => {
  return useQuery<Telemetry2dData[]>({
    queryKey: ["telemetry2D", selectedDrone?._id, selectedOperationAndDate?.operationId],
    queryFn: async () => {
      if (!selectedDrone || !selectedOperationAndDate) {
        return [];
      }

      console.log("fetchTelemetryData 실행:", {
        droneId: selectedDrone._id,
        operationId: selectedOperationAndDate.operationId,
      });

      const data = (await fetchTelemetryData(
        selectedOperationAndDate.operationId,
        selectedDrone._id
      )) ?? [];

      console.log("fetchTelemetryData 반환값:", data);

      if (data.length === 0) {
        console.warn("가져온 텔레메트리 데이터가 없음");
      }

      return filterTelemetryData(data, "2D_MAP");
    },
    enabled: !!selectedDrone && !!selectedOperationAndDate,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};