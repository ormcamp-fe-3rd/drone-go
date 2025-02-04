// API 호출
export const fetchRobots = async () => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch("http://localhost:3000/robots", { headers });
  if (!response.ok) {
    localStorage.removeItem("token");
    alert("Your session has expired. Please log in again.");
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
    throw new Error("Unauthorized user");
  }
  return response.json();
};

export const fetchOperationsByRobot = async (robotId: string) => {
  if (!robotId) {
    throw new Error("robotId is missing");
  }

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // 1. 먼저 operations 데이터를 가져옵니다
    const operationsUrl = `http://localhost:3000/operations?robot=${encodeURIComponent(robotId)}`;
    const operationsResponse = await fetch(operationsUrl, { headers });

    if (!operationsResponse.ok) {
      handleUnauthorized(operationsResponse.status);
      throw new Error(
        `Failed to fetch operations: ${operationsResponse.statusText}`,
      );
    }

    const operations = await operationsResponse.json();

    // 2. 모든 operation들의 고유한 날짜 데이터를 한 번에 가져옵니다
    const operationIds = operations
      .map((op: { _id: string }) => op._id)
      .join(",");
    const telemetriesUrl = `http://localhost:3000/telemetries/distinctDates?robot=${encodeURIComponent(
      robotId,
    )}&operations=${encodeURIComponent(operationIds)}`;
    console.log("Telemetries URL:", telemetriesUrl); // URL 확인
    const telemetriesResponse = await fetch(telemetriesUrl, { headers });

    if (!telemetriesResponse.ok) {
      handleUnauthorized(telemetriesResponse.status);
      throw new Error(
        `Failed to fetch telemetries: ${telemetriesResponse.statusText}`,
      );
    }

    const telemetriesData = await telemetriesResponse.json();
    console.log("Telemetries Data:", telemetriesData);

    // 3. 결과 매핑
    return operations.map((operation: { _id: string }) => ({
      operationId: operation._id,
      dates: telemetriesData[operation._id] || [],
    }));
  } catch (error) {
    console.error("Error fetching operations:", error);
    throw error;
  }
};

// 401 에러 처리를 위한 헬퍼 함수
const handleUnauthorized = (status: number) => {
  if (status === 401) {
    localStorage.removeItem("token");
    alert("Your session has expired. Please log in again.");
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
    throw new Error("Unauthorized user");
  }
};
