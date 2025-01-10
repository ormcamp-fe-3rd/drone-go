import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AttitudeViewer from "@/components/AttitudeViewer";

// 비행 정보 가져오는 API
const fetchOperations = async () => {
  const response = await fetch('/api/operations');
  if (!response.ok) {
    throw new Error('Failed to fetch operations');
  }
  return response.json();
};

// 드론 정보 가져오는 API
const fetchRobots = async () => {
  const response = await fetch('/api/robots');
  if (!response.ok) {
    throw new Error('Failed to fetch robots');
  }
  return response.json();
};

const MapPage = () => {
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);

  // 비행과 드론 데이터 요청
  const { data: operations, isLoading: isOperationsLoading, error: operationsError } = useQuery({
    queryKey: ['operations'],
    queryFn: fetchOperations
  });

  const { data: robots, isLoading: isRobotsLoading, error: robotsError } = useQuery({
    queryKey: ['robots'],
    queryFn: fetchRobots
  });

  const handleDroneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDrone(e.target.value);
  };

  const handleFlightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFlight(e.target.value);
  };

  const getRobotId = (robotId: string) => {
    const robot = robots?.find((r) => r.id === robotId);
    return robot ? robot.robot_id : '';
  };

  const getOperationId = (operationId: string) => {
    const operation = operations?.find((o) => o.id === operationId);
    return operation ? operation.id : '';
  };

  const robotId = selectedDrone ? getRobotId(selectedDrone) : null;
  const operationId = selectedFlight ? getOperationId(selectedFlight) : null;

  // 로딩 및 에러 처리
  if (isOperationsLoading || isRobotsLoading) {
    return <div>Loading...</div>;
  }

  if (operationsError instanceof Error) {
    return <div>Error loading operations: {operationsError.message}</div>;
  }

  if (robotsError instanceof Error) {
    return <div>Error loading robots: {robotsError.message}</div>;
  }

  return (
    <>
      <div className="bg-slate-400">
        <h2>드론 및 비행 종류 선택</h2>

        {/* 드론 종류 선택 드롭다운 */}
        <label htmlFor="droneSelect">드론 선택:</label>
        <select id="droneSelect" onChange={handleDroneChange} value={selectedDrone || ''}>
          <option value="">드론 선택</option>
          {robots?.map((robot) => (
            <option key={robot.id} value={robot.id}>
              {robot.name}
            </option>
          ))}
        </select>

        {/* 비행 종류 선택 드롭다운 */}
        <label htmlFor="flightSelect">비행 선택:</label>
        <select id="flightSelect" onChange={handleFlightChange} value={selectedFlight || ''}>
          <option value="">비행 선택</option>
          {operations?.map((operation) => (
            <option key={operation.id} value={operation.id}>
              {`비행 ${operation.id}`} {/* 실제 비행 이름을 표시할 수 있음 */}
            </option>
          ))}
        </select>

        {/* 선택된 값에 맞는 AttitudeViewer 렌더링 */}
        {robotId && operationId && (
          <AttitudeViewer robotId={robotId} operationId={operationId} />
        )}
      </div>
    </>
  );
};

export default MapPage;

