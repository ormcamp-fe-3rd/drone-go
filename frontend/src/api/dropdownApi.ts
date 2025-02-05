// API 호출
export const fetchRobots = async () => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(import.meta.env.VITE_API_URL, { headers });
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
    const operationsUrl = `${import.meta.env.VITE_API_URL}/operations?robot=${encodeURIComponent(robotId)}`;
    const operationsResponse = await fetch(operationsUrl, { headers });

    if (!operationsResponse.ok) {
      handleUnauthorized(operationsResponse.status);
      throw new Error(
        `Failed to fetch operations: ${operationsResponse.statusText}`,
      );
    }

    const operations = await operationsResponse.json();

    const operationIds = operations
      .map((op: { _id: string }) => op._id)
      .join(",");
    const telemetriesUrl = `${import.meta.env.VITE_API_URL}/telemetries/distinctDates?robot=${encodeURIComponent(
      robotId,
    )}&operations=${encodeURIComponent(operationIds)}`;
    const telemetriesResponse = await fetch(telemetriesUrl, { headers });

    if (!telemetriesResponse.ok) {
      handleUnauthorized(telemetriesResponse.status);
      throw new Error(
        `Failed to fetch telemetries: ${telemetriesResponse.statusText}`,
      );
    }

    const telemetriesData = await telemetriesResponse.json();

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
