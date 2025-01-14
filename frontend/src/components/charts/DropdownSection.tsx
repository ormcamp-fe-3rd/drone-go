import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRobots, fetchOperationsByRobot } from "../../api/dropdownApi";
import DropdownComponent from "../../components/charts/DropdownComponent";
import { Robot, Operation } from "../../types/dropdown";

interface DropdownSectionProps {
  className?: string; // className을 받을 수 있도록 추가
}

const DropdownSection: React.FC<DropdownSectionProps> = ({ className }) => {
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null); // 선택된 드론 상태 추가
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null,
  ); // 선택된 operation 상태

  const {
    data: robots,
    isLoading: isRobotsLoading,
    error: robotsError,
  } = useQuery({
    queryKey: ["robots"],
    queryFn: fetchRobots,
  });

  const {
    data: operations = [],
    isLoading: isOperationsLoading,
    error: operationsError,
  } = useQuery({
    queryKey: ["operations", selectedDrone?._id],
    queryFn: () => fetchOperationsByRobot(selectedDrone?._id || ""),
    enabled: !!selectedDrone?._id,
  });

  const handleDroneSelect = (robot: Robot) => {
    console.log("Selected Drone:", robot);
    setSelectedDrone(robot);
    setSelectedOperation(null);
  };

  const handleOperationSelect = (operation: Operation) => {
    console.log("Selected operation:", operation);
    setSelectedOperation(operation);
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
    <div
      className={`mx-3 flex flex-wrap justify-center gap-3 md:flex-nowrap md:justify-end ${className}`}
    >
      <DropdownComponent
        label={selectedDrone ? selectedDrone.name : "Select Drone"}
        onSelect={handleDroneSelect}
        data={robots || []}
      />
      <DropdownComponent
        label={
          selectedOperation
            ? `Operation ${operations.findIndex((op: Operation) => op._id === selectedOperation._id) + 1}`
            : "Select Operation"
        }
        onSelect={handleOperationSelect}
        data={operations || []}
      />
    </div>
  );
};

export default DropdownSection;
