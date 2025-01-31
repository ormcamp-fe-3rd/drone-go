import React from "react";
import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { fetchRobots, fetchOperationsByRobot } from "../../api/dropdownApi";
import DropdownComponent from "../../components/charts/DropdownComponent";
import { Robot } from "../../types/selectOptionsTypes";

interface OperationAndDate {
  operationId: string;
  date: string;
  name: string;
}
interface DropdownSectionProps {
  className?: string; // className을 받을 수 있도록 추가
  selectedDrone: Robot | null;
  setSelectedDrone: React.Dispatch<React.SetStateAction<Robot | null>>;
  selectedOperationAndDate: OperationAndDate | null;
  setSelectedOperationAndDate: React.Dispatch<
    React.SetStateAction<OperationAndDate | null>
  >;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({
  className,
  selectedDrone,
  setSelectedDrone,
  selectedOperationAndDate,
  setSelectedOperationAndDate,
}) => {
  const {
    data: robots,
    isLoading: isRobotsLoading,
    error: robotsError,
  } = useQuery({
    queryKey: ["robots"],
    queryFn: fetchRobots,
  });

  const {
    data: operationAndDates = [],
    isLoading: isOperationsLoading,
    error: operationsError,
  } = useQuery({
    queryKey: ["operationAndDates", selectedDrone?._id],
    queryFn: () => fetchOperationsByRobot(selectedDrone?._id || ""),
    enabled: !!selectedDrone?._id,
    select: (data) => {
      return data
        .map((item) => {
          const operationId = item.operationId;
          const date =
            item.dates && item.dates[0] ? item.dates[0] : "No Date Available";

          return {
            operationId,
            date,
          };
        })
        .sort((a, b) => {
          if (a.operationId === b.operationId) {
            return a.date.localeCompare(b.date);
          }
          return b.operationId.localeCompare(a.operationId);
        });
    },
  });

  const handleDroneSelect = (item: { _id: string; name: string }) => {
    //데이터 확인용 배포 이전 console.log 삭제 예정
    console.log("Selected Drone:", item);
    setSelectedDrone(item as Robot);
    setSelectedOperationAndDate(null);
  };

  const handleOperationAndDateSelect = (item: OperationAndDate) => {
    //데이터 확인용 배포 이전 console.log 삭제 예정
    console.log("Selected operation and date:", item);
    setSelectedOperationAndDate(item);
  };

  if (robotsError instanceof Error) {
    return <div>Error loading robots: {robotsError.message}</div>;
  }

  if (operationsError instanceof Error) {
    return <div>Error loading operations: {operationsError.message}</div>;
  }

  return (
    <div
      className={twMerge(
        `mx-3 flex flex-wrap justify-center gap-3 md:flex-nowrap md:justify-end ${className}`,
      )}
    >
      {!isRobotsLoading && (
        <DropdownComponent
          value={selectedDrone ? selectedDrone.name : "Select Drone"}
          onSelect={handleDroneSelect}
          data={robots || []}
        />
      )}
      {!isOperationsLoading && (
        <DropdownComponent
          value={
            selectedOperationAndDate
              ? selectedOperationAndDate.name
              : "Select Operation | Date"
          }
          onSelect={handleOperationAndDateSelect}
          data={operationAndDates.map((item, index) => ({
            _id: item.operationId,
            //_id: `${item.operation}-${item.date}-${index}`, // 고유한 _id를 추가
            name: `Op ${index + 1}  |  ${item.date}`,
            operationId: item.operationId,
            date: item.date,
          }))}
        />
      )}
    </div>
  );
};

export default DropdownSection;
