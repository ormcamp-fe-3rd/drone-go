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
    const response = await fetch(url, {headers});
    if (!response.ok) {
      if (response.status === 401) {
        // 로그인 토큰이 유효하지 않음
        throw new Error("Unauthorized user");
      }
      throw new Error(`Failed to fetch operations: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching operations:", error);
    throw error;
  }
};