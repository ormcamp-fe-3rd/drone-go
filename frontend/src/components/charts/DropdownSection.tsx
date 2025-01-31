import React from "react";
import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { fetchRobots, fetchOperationsByRobot } from "../../api/dropdownApi";
import DropdownComponent from "../../components/charts/DropdownComponent";
import { Robot } from "../../types/selectOptionsTypes";

interface OperationAndDate {
  operationId: string;
  timestamp: string; // 정렬용 원본 데이터
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
      const processedData = data.map((item) => {
        const operationId = item.operationId;
        const timestamp =
          item.dates && item.dates[0] ? item.dates[0] : "No Date Available";

        const actualTimestamp = timestamp.timestamp || timestamp;

        return { operationId, timestamp: actualTimestamp };
      });

      const sortedData = processedData.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();

        if (timeA !== timeB) {
          return timeB - timeA;
        }

        return Number(b.operationId) - Number(a.operationId);
      });

      return sortedData;
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
          data={operationAndDates.map((item, index) => {
            const formattedTimestamp = new Date(item.timestamp);
            const localDate =
              formattedTimestamp instanceof Date &&
              !isNaN(formattedTimestamp.getTime())
                ? formattedTimestamp.toISOString().split("T")[0]
                : "Invalid Date"; // 유효하지 않은 날짜일 경우 기본 값 설정
            return {
              _id: item.operationId,
              name: `Op ${operationAndDates.length - index}   |   ${localDate}`,
              operationId: item.operationId,
              timestamp: item.timestamp,
            };
          })}
        />
      )}
    </div>
  );
};

export default DropdownSection;
