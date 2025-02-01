import { useQuery } from "@tanstack/react-query";
import { getDroneTelemetryAPI, Operation, Telemetry } from "@/api/generatedClient";

const { getOperations, getTelemetries } = getDroneTelemetryAPI();

// ✅ 특정 로봇의 오퍼레이션 데이터를 필터링링
const filterOperationsByRobot = (data: Operation[], robotId: string) => {
  return data.filter((operation) => operation.robot === robotId);
};

// ✅ 특정 오퍼레이션의 timestamp 필터링 (날짜 부분만 추출)
const filterTimestampsByOperation = (data: Telemetry[], operationId: string) => {
  return data
    .filter((telemetry) => telemetry.operation === operationId)
    .map((telemetry) => {
      const date = new Date(telemetry.timestamp);
      return date.getTime();
    })
    .sort((a, b) => a - b);
};

// 데이터 요청 훅
export const useOperationsByRobot = (robotId?: string) => {
  return useQuery({
    queryKey: ["operations", robotId],
    queryFn: async () => {
      if (!robotId) return [];
      const response = await getOperations({ robot: robotId });
      return filterOperationsByRobot(response ?? [], robotId);
    },
    enabled: !!robotId,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10, 
  });
};

// ✅ 특정 오퍼레이션의 타임스탬프를 가져오는 훅
export const useTimestampsByOperation = (robotId?: string, operationId?: string) => {
  return useQuery({
    queryKey: ["timestamps", robotId, operationId],
    queryFn: async () => {
      if (!robotId || !operationId) return [];
      const response = await getTelemetries({ robot: robotId, operation: operationId });
      return filterTimestampsByOperation(response ?? [], operationId);
    },
    enabled: !!robotId && !!operationId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
