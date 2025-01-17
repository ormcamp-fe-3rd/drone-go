// API 호출
export const fetchRobots = async () => {
  const response = await fetch("http://localhost:3000/robots");
  if (!response.ok) {
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

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch operations: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching operations:", error);
    throw error;
  }
};