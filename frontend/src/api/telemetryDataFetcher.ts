import apiClient from "./axiosInstance";
import { Telemetry } from "@/types/telemetryDataTypes";

export const fetchTelemetryData = async (
  operationId?: string,
  robotId?: string,
): Promise<Telemetry[]> => {
  if (!operationId || !robotId) {
    console.warn("유효하지 않은 operationId 또는 robotId. 빈 배열 반환");
    return [];
  }

  try {
    const { data } = await apiClient.get<Telemetry[]>("/telemetries/map", {
      params: { operation: operationId, robot: robotId },
    });

    return data ?? [];
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return [];
  }
};
