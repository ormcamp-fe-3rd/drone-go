import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// API 호출출
const fetchRobots = async () => {
  const response = await fetch('http://localhost:3000/api/robots');
  if (!response.ok) {
    throw new Error('Failed to fetch robots');
  }
  return response.json();
};

const fetchOperationsByRobot = async (robotId: string) => {
  const url = `http://localhost:3000/api/operations/filter?robotId=${encodeURIComponent(robotId)}`;
  console.log(`Fetching operations for robot: ${robotId}`);
  const response = await fetch(url);
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
  _id: string;
  name: string;
}

const MapPage = () => {
  const { data: robots, isLoading: isRobotsLoading, error: robotsError } = useQuery({
    queryKey: ['robots'],
    queryFn: fetchRobots,
  });

  const [selectedDrone, setSelectedDrone] = useState<string>('');

  const { data: operations, isLoading: isOperationsLoading, error: operationsError } = useQuery({
    queryKey: ['operations', selectedDrone],
    queryFn: () => fetchOperationsByRobot(selectedDrone),
    enabled: !!selectedDrone,  // selectedDrone이 설정된 경우에만 요청
  });

  const handleDroneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    console.log('Selected robotId:', selectedId);
    setSelectedDrone(selectedId);
  };

  if (isRobotsLoading || isOperationsLoading) {
    return <div>Loading...</div>;
  }

  if (robotsError instanceof Error) {
    return <div>Error loading robots: {robotsError.message}</div>;
  }

  if (operationsError instanceof Error) {
    return <div>Error loading operations: {operationsError.message}</div>;
  }

  return (
    <div className="bg-slate-400 p-4">
      <h2>드론 및 오퍼레이션 선택</h2>

      {/* 드론 종류 선택 드롭다운 */}
      <label htmlFor="droneSelect">드론 선택:</label>
      <select id="droneSelect" onChange={handleDroneChange} value={selectedDrone}>
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
        {operations?.map((operation: Operation) => (
          <option key={operation._id} value={operation._id}>
            {`op. ${String(operation._id).slice(-4)}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MapPage;






















