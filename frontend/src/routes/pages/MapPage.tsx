import { useQuery } from '@tanstack/react-query';

// 로봇 정보 가져오는 API
const fetchRobots = async () => {
  const response = await fetch('http://localhost:3000/api/robots');
  if (!response.ok) {
    throw new Error('Failed to fetch robots');
  }
  return response.json();
};

// 오퍼레이션 정보 가져오는 API
const fetchOperations = async () => {
  const response = await fetch('http://localhost:3000/api/operations');
  if (!response.ok) {
    throw new Error('Failed to fetch operations');
  }
  return response.json();
};

interface Robot {
  id: string;
  name: string;
}

interface Operation {
  _id: string;  // MongoDB ObjectId이므로 string으로 처리
  name: string;
}

const MapPage = () => {
  const { data: robots, isLoading: isRobotsLoading, error: robotsError } = useQuery({
    queryKey: ['robots'],
    queryFn: fetchRobots,
  });

  const { data: operations, isLoading: isOperationsLoading, error: operationsError } = useQuery({
    queryKey: ['operations'],
    queryFn: fetchOperations,
  });

  // 로딩 및 에러 처리
  if (isRobotsLoading || isOperationsLoading) {
    return <div>Loading...</div>;
  }

  if (robotsError instanceof Error) {
    return <div>Error loading robots: {robotsError.message}</div>;
  }

  if (operationsError instanceof Error) {
    return <div>Error loading operations: {operationsError.message}</div>;
  }

  // 디버깅을 위한 로그
  console.log("Operations:", operations);

  return (
    <div className="bg-slate-400 p-4">
      <h2>드론 및 오퍼레이션 선택</h2>

      {/* 드론 종류 선택 드롭다운 */}
      <label htmlFor="droneSelect">드론 선택:</label>
      <select id="droneSelect">
        <option value="">드론 선택</option>
        {robots?.map((robot: Robot) => (
          <option key={robot.id} value={robot.id}>
            {robot.name}
          </option>
        ))}
      </select>

      {/* 오퍼레이션 종류 선택 드롭다운 */}
      <label htmlFor="operationSelect">오퍼레이션 선택:</label>
      <select id="operationSelect">
        <option value="">오퍼레이션 선택</option>
        {operations?.map((operation: Operation) => {
          console.log("Operation:", operation);  // 오퍼레이션 로그 출력

          return (
            <option key={operation._id} value={operation._id}>
              {operation._id ? String(operation._id).slice(-2) : "No ID"} {/* _id가 존재하면 뒤 두 글자만 표시 */}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default MapPage;

















