// API 호출
export const fetchRobots = async () => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  
  const response = await fetch("http://localhost:3000/robots", {headers});
  if (!response.ok) {
    if (response.status === 401) {
      // 로그인 토큰이 유효하지 않음
      throw new Error("Unauthorized user");
    }
    throw new Error("Failed to fetch robots");
  }
  return response.json();
};

export const fetchOperationsByRobot = async (robotId: string) => {
  if (!robotId) {
    throw new Error("robotId is missing");
  }
  const url = `http://localhost:3000/operations?robot=${encodeURIComponent(robotId)}`;
  console.log("Fetching operations with URL:", url); // TODO: 배포 이후 제거

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  
  try {
    const operationsResponse = await fetch(url, {headers});
    if (!operationsResponse.ok) {
      if (operationsResponse.status === 401) {
        // 로그인 토큰이 유효하지 않음
        throw new Error("Unauthorized user");
      }
      throw new Error(
        `Failed to fetch operations: ${operationsResponse.statusText}`,
      );
    }
    const operations = await operationsResponse.json();
    // 텔레메트리 데이터 가져오기
    const operationsWithDates = await Promise.all(
      operations.map(async (operation: { _id: string }) => {
        if (!operation || !operation._id) {
          return null; // operation이 없으면 null 반환
        }

        const telemetriesUrl = `http://localhost:3000/telemetries?robot=${encodeURIComponent(
          robotId,
        )}&operation=${encodeURIComponent(operation._id)}&fields=timestamp`;

        const telemetriesResponse = await fetch(telemetriesUrl);
        if (!telemetriesResponse.ok) {
          throw new Error(
            `Failed to fetch telemetries: ${telemetriesResponse.statusText}`,
          );
        }
        const telemetries = await telemetriesResponse.json();

        interface Telemetry {
          timestamp: string;
        }
        const uniqueDatesWithTimestamp = [
          ...new Map(
            telemetries.map((telemetry: Telemetry) => {
              return [
                telemetry.timestamp, // timestamp 그대로 사용
                { timestamp: telemetry.timestamp }, // timestamp만 포함
              ];
            }),
          ).values(),
        ];

        // operationId 정상적으로 존재하는지 확인
        const operationId = operation._id || "Unknown Operation";

        return {
          operationId: operationId, //operation._id,
          dates: uniqueDatesWithTimestamp, // 해당 오퍼레이션의 날짜 정보
        };
      }),
    );

    const validOperations = operationsWithDates.filter(
      (operation) => operation !== null,
    );
    return validOperations;
  } catch (error) {
    console.error("Error fetching operations:", error);
    throw error;
  }
};
