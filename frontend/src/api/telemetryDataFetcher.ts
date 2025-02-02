import apiClient from "./axiosInstance";
import { Telemetry } from "@/types/telemetryDataTypes";

export const fetchTelemetryData = async (
  operationId: string | undefined,
  robotId: string | undefined
): Promise<Telemetry[]> => {
  if (!operationId || !robotId) {
    console.warn("⚠️ 유효하지 않은 operationId 또는 robotId. 빈 배열 반환");
    return [];
  }

  console.log("📌 API 요청 시작 - operationId:", operationId, "robotId:", robotId);

  try {
    const response = await apiClient.get<Telemetry[]>("/telemetries", {
      params: { operation: operationId, robot: robotId },
    });

    console.log("📌 API 응답 데이터:", response.data);

    return response.data ?? []; // ✅ API 응답이 undefined면 빈 배열 반환
  } catch (error) {
    console.error("❌ API 요청 중 오류 발생:", error);
    return []; // ✅ 에러 발생 시 빈 배열 반환하여 UI에서 undefined 에러 방지
  }
};
