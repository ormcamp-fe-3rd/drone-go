import apiClient from "./apiClient";

export const fetchTelemetryData = async <T>(
  pageKey: string, 
  operationId?: string,
  robotId?: string
): Promise<T[]> => { // 반환 타입을 호출 시점에서 결정할 수 있도록 제네릭 적용!
  if (!operationId || !robotId) {
    console.warn("유효하지 않은 operationId 또는 robotId. 빈 배열 반환");
    return [];
  }

  try {
    const { data } = await apiClient.get<T[]>("/telemetries", {
      params: { robot: robotId, operation: operationId, pageKey },
    });

    return data ?? [];
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return [];
  }
};
