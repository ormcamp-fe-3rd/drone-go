import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDroneTelemetryAPI } from "@/api/generatedClient";
import { twMerge } from "tailwind-merge";
import { Robot, Operation } from "@/api/generatedClient";
import { useOperationsByRobot } from "@/api/operationData";
import { useTimestampsByOperation } from "@/api/operationData";
import DropdownComponent from "../../components/charts/DropdownComponent";

const { getRobots } = getDroneTelemetryAPI();

interface DropdownSectionProps {
  className?: string;
  selectedDrone: Robot | null;
  setSelectedDrone: React.Dispatch<React.SetStateAction<Robot | null>>;
  selectedOperation: Operation | null;
  setSelectedOperation: React.Dispatch<React.SetStateAction<Operation | null>>;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({
  className,
  selectedDrone,
  setSelectedDrone,
  selectedOperation,
  setSelectedOperation,
}) => {
  // ✅ 로봇 목록 API 호출
  const { data: robots = [], isLoading: isRobotsLoading, error: robotsError } = useQuery({
    queryKey: ["robots"],
    queryFn: getRobots,
    staleTime: 1000 * 60 * 5,
  });

  // 선택된 로봇의 오퍼레이션 목록 API 호출
  const { data: operations = [], isLoading: isOperationsLoading, error: operationsError } = useOperationsByRobot(
    selectedDrone?._id || ""
  );

  // 선택된 오퍼레이션의 타임스탬프 필터링 데이터 가져오기
  const { data: timestamps = [], isLoading: isTimestampsLoading, error: timestampsError } = useTimestampsByOperation(
    selectedDrone?._id || "",
    selectedOperation?._id || ""
  );

  const handleDroneSelect = (robot: Robot) => {
    setSelectedDrone(robot);
    setSelectedOperation(null);
  };

  const handleOperationSelect = (operationId: string) => {
    const selectedOp = operations.find((op) => op._id === operationId);
    if (selectedOp) {
      setSelectedOperation(selectedOp);
    }
  };

  const formattedOperations = operations.map((op, index) => {

    const formattedDate = timestamps.length > 0
      ? new Date(timestamps[0]).toISOString().split("T")[0] 
      : "날짜 없음";

    return {
      _id: op._id,
      name: `${formattedDate} 오퍼레이션 ${index + 1}`,
    };
  });

  if (robotsError instanceof Error) {
    return <div className="text-red-500">Error loading robots: {robotsError.message}</div>;
  }

  if (operationsError instanceof Error) {
    return <div className="text-red-500">Error loading operations: {operationsError.message}</div>;
  }

  if (timestampsError instanceof Error) {
    return <div className="text-red-500">Error loading timestamps: {timestampsError.message}</div>;
  }

  return (
    <div className={twMerge(`mx-3 flex flex-wrap justify-center gap-3 md:flex-nowrap md:justify-end ${className}`)}>
      {!isRobotsLoading && (
        <DropdownComponent
          value={selectedDrone ? selectedDrone.name : "Select Drone"}
          onSelect={(robot) => handleDroneSelect(robot as Robot)}
          data={robots}
        />
      )}
      {!isOperationsLoading && selectedDrone && formattedOperations.length > 0 && (
        <DropdownComponent
          value={
            selectedOperation
              ? formattedOperations.find((op) => op._id === selectedOperation._id)?.name ?? "Select Operation"
              : "Select Operation"
          }
          onSelect={(operation) => handleOperationSelect(operation._id)}
          data={formattedOperations}
        />
      )}
      {!isTimestampsLoading && selectedOperation && timestamps.length ? (
        <div>
          <h3 className="text-center text-sm text-gray-500">
            Filtered Timestamps: {timestamps.length ?? 0}
          </h3>
        </div>
      ) : null}
    </div>
  );
};

export default DropdownSection;

