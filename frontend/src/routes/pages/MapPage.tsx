import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 텔레메트리 데이터 가져오는 API
const fetchTelemetries = async () => {
  const response = await fetch('http://localhost:3000/api/telemetries');
  if (!response.ok) {
    throw new Error('Failed to fetch telemetries');
  }
  return response.json();
};

// 드론 정보 가져오는 API
const fetchRobots = async () => {
  const response = await fetch('http://localhost:3000/api/robots');
  if (!response.ok) {
    throw new Error('Failed to fetch robots');
  }
  return response.json();
};

// 오퍼레이션 데이터 가져오는 API
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

interface Telemetry {
  robot: string;       // 로봇 id (문자열 또는 ObjectId)
  operation: string;   // operation id (문자열 또는 ObjectId)
  timestamp: string;   // 타임스탬프 (날짜 포함)
}

interface Operation {
  id: string;
  name: string;
}

const MapPage = () => {
  const [selectedDrone, setSelectedDrone] = useState<string>(''); // 선택된 드론
  const [selectedOperation, setSelectedOperation] = useState<string>(''); // 선택된 오퍼레이션
  const [filteredDates, setFilteredDates] = useState<string[]>([]); // 필터링된 날짜 목록
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]); // 필터링된 오퍼레이션 목록

  // 텔레메트리, 로봇, 오퍼레이션 데이터 요청
  const { data: telemetries, isLoading: isTelemetriesLoading, error: telemetriesError } = useQuery({
    queryKey: ['telemetries'],
    queryFn: fetchTelemetries,
  });

  const { data: robots, isLoading: isRobotsLoading, error: robotsError } = useQuery({
    queryKey: ['robots'],
    queryFn: fetchRobots,
  });

  const { data: operations, isLoading: isOperationsLoading, error: operationsError } = useQuery({
    queryKey: ['operations'],
    queryFn: fetchOperations,
  });

  // 드론 선택 핸들러
  const handleDroneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDrone(e.target.value);
    setSelectedOperation(''); // 드론을 바꿀 때 오퍼레이션도 초기화
    setFilteredDates([]); // 날짜도 초기화
  };

  // 오퍼레이션 선택 핸들러
  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperation(e.target.value);
    setFilteredDates([]); // 오퍼레이션을 바꿀 때 날짜도 초기화
  };

  // 선택된 드론에 따라 오퍼레이션과 날짜 필터링
  useEffect(() => {
    if (selectedDrone && telemetries && operations) {
      // 1. 드론에 해당하는 오퍼레이션 필터링
      const selectedOperations = operations.filter((operation: Operation) =>
        telemetries.some((telemetry: Telemetry) => {
          // ObjectId 비교: 텔레메트리에서 로봇과 오퍼레이션을 ObjectId로 비교
          return telemetry.robot === selectedDrone && telemetry.operation === operation.id;
        })
      );
      setFilteredOperations(selectedOperations); // 필터링된 오퍼레이션 목록 설정

      // 2. 선택된 오퍼레이션에 대한 날짜 필터링
      if (selectedOperation) {
        const filtered = telemetries
          .filter((item: Telemetry) => item.robot === selectedDrone && item.operation === selectedOperation)
          .map((item: Telemetry) => item.timestamp.split('T')[0]); // 날짜만 추출

        // 날짜 중복 제거
        const uniqueDates = Array.from(new Set(filtered)) as string[]; // 타입 명시
        setFilteredDates(uniqueDates); // 필터링된 날짜 목록 업데이트
      }
    }
  }, [selectedDrone, selectedOperation, telemetries, operations]);

  // 로딩 및 에러 처리
  if (isTelemetriesLoading || isRobotsLoading || isOperationsLoading) {
    return <div>Loading...</div>;
  }

  if (telemetriesError instanceof Error) {
    return <div>Error loading telemetry: {telemetriesError.message}</div>;
  }

  if (robotsError instanceof Error) {
    return <div>Error loading robots: {robotsError.message}</div>;
  }

  if (operationsError instanceof Error) {
    return <div>Error loading operations: {operationsError.message}</div>;
  }

  return (
    <div className="bg-slate-400 p-4">
      <h2>드론 및 비행 종류 선택</h2>

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
      <select id="operationSelect" onChange={handleOperationChange} value={selectedOperation}>
        <option value="">오퍼레이션 선택</option>
        {filteredOperations.length > 0 ? (
          filteredOperations.map((operation: Operation) => (
            <option key={operation.id} value={operation.id}>
              {operation.name}
            </option>
          ))
        ) : (
          <option value="">선택된 드론에 대한 오퍼레이션이 없습니다.</option>
        )}
      </select>

      {/* 비행 날짜 선택 드롭다운 */}
      <label htmlFor="flightSelect">비행 날짜 선택:</label>
      <select id="flightSelect">
        <option value="">비행 날짜 선택</option>
        {filteredDates.length > 0 ? (
          filteredDates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))
        ) : (
          <option value="">선택된 드론 및 오퍼레이션에 대한 비행이 없습니다.</option>
        )}
      </select>
    </div>
  );
};

export default MapPage;








