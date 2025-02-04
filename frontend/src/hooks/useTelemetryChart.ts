import { useQuery } from "@tanstack/react-query";
import { fetchTelemetryData } from "@/api/fetchTelemetryData";
import { TelemetryChartData } from "@/types/telemetryChartDataTypes";
import { Robot } from "@/types/selectOptionsTypes";
import { MSG_ID } from "@/constants";
import { processAltAndSpeedData } from "@/utils/processAltAndSpeedData";

type OperationInfo = {
  operationId: string;
  timestamp: string;
  name: string;
};

// 메시지 ID별 데이터를 자동 매핑할 객체 타입 정의
export type TelemetryDataByMsgId = {
  [key in keyof typeof MSG_ID]: TelemetryChartData[] | null;
};

export const useTelemetryChart = (
  selectedDrone: Robot | null,
  selectedOperationAndDate: OperationInfo | null
) => {
  return useQuery<TelemetryDataByMsgId & { altAndSpeedData: any }>({
    queryKey: ["telemetryChart", selectedDrone?._id, selectedOperationAndDate?.operationId],
    queryFn: async () => {
      if (!selectedDrone || !selectedOperationAndDate) {
        return Object.keys(MSG_ID).reduce((acc, key) => {
          acc[key as keyof typeof MSG_ID] = null;
          return acc;
        }, { altAndSpeedData: null } as TelemetryDataByMsgId & { altAndSpeedData: any });
      }

      console.log("fetchTelemetryData 실행:", {
        droneId: selectedDrone._id,
        operationId: selectedOperationAndDate.operationId,
      });

      const rawData = await fetchTelemetryData<TelemetryChartData>(
        "CHART",
        selectedOperationAndDate.operationId,
        selectedDrone._id
      );

      console.log("fetchTelemetryData 반환값:", rawData);

      if (rawData.length === 0) {
        console.warn("가져온 텔레메트리 데이터가 없음");
      }

      // timestamp를 Date 객체로 변환하여 모든 데이터에 적용
      const processedData = rawData.map((entry) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));

      // 메시지 ID별 데이터 분류
      const categorizedData = Object.entries(MSG_ID).reduce((acc, [key, msgId]) => {
        const filteredData = processedData.filter((entry) => entry.msgId === msgId);
        acc[key as keyof typeof MSG_ID] = filteredData.length > 0 ? filteredData : null;
        return acc;
      }, {} as TelemetryDataByMsgId);

      // alt와 speed 데이터를 합쳐서 새로운 데이터 만들기
      const altAndSpeedData = processAltAndSpeedData(processedData);

      return {
        ...categorizedData,
        altAndSpeedData,
      };
    },
    enabled: !!selectedDrone && !!selectedOperationAndDate,
    staleTime: 1000 * 60 * 8,
    retry: 1,
  });
};
