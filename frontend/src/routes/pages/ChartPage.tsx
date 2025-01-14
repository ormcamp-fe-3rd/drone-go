import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import DropdownComponent from "../../components/charts/DropdownComponent";

// API 호출
const fetchRobots = async (): Promise<Robot[]> => {
  const response = await fetch("http://localhost:3000/robots");
  if (!response.ok) {
    throw new Error("Failed to fetch robots");
  }
  return response.json();
};

const fetchOperationsByRobot = async (
  robotId: string,
): Promise<Operation[]> => {
  if (!robotId) {
    throw new Error("robotId is missing");
  }
  const url = `http://localhost:3000/operations/filter?robot=${encodeURIComponent(robotId)}`;
  console.log("Fetching operations with URL:", url); // URL 확인

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

interface Robot {
  _id: string;
  name: string;
  robot_id: string;
}

interface Operation {
  _id: string;
  name: string;
  robot: string;
}

const DropdownSection: React.FC = () => {
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
    <div className="flex gap-3 mx-3">
      <DropdownComponent
        label={selectedDrone ? selectedDrone.name : "Select Drone"}
        onSelect={handleDroneSelect}
        data={robots || []}
      />
      <DropdownComponent
        label={
          selectedOperation
            ? `Operation ${operations.findIndex((op) => op._id === selectedOperation._id) + 1}`
            : "Select Operation"
        }
        onSelect={handleOperationSelect}
        data={operations || []}
      />
    </div>
  );
};

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="h-[400px]">
    <h2>{title}</h2>
    {children}
  </div>
);

const ChartPage: React.FC = () => {
  return (
    <>
      {/* 상단 */}
      <div className="mx-10 my-8 flex flex-row items-center justify-evenly gap-4 rounded-[10px] border px-5 py-4">
        {/* btn클릭 시 list 페이지로 */}
        <Button className="h-20 w-14 min-w-[56px]" variant="ghost">
          {/*드론 리스트 페이지로 이동*/}
          <Link to="/HomePage">
            <img
              src="/icons/ListPage.png"
              alt="Button Icon"
              className="object-contain h-20 w-14"
            />
          </Link>
        </Button>
        {/* text div*/}
        <article className="w-2/3 min-w-[226px]">
          <h1 className="text-3xl font-semibold">Detailed Data</h1>
          <span className="hidden text-sm sm:block">
            Visualize drone data with interactive charts and maps. <br />
            Exploretrends and movement patterns for the selected date.
          </span>
        </article>
        <DropdownSection />
        <Button className="h-16 w-16 min-w-[64px] rounded-[10px]">
          <img
            src="/icons/download.png"
            alt="Button Icon"
            className="object-contain w-16 h-16"
          />
        </Button>
        <Button className="h-16 w-16 min-w-[64px] rounded-[10px]">
          <img
            src="/icons/maps.png"
            alt="Button Icon"
            className="object-contain w-16 h-16"
          />
        </Button>
      </div>
      {/* 차트 및 데이터 값들 */}
      <div className="grid grid-cols-1 gap-3 mx-10 my-8 lg:grid-cols-2">
        <div className="flex h-[400px] gap-3">
          <div className="flex flex-col w-3/5">
            <h2 className="mx-10 my-5 text-2xl font-semibold">
              Name : 드론종류
            </h2>
            <div className="mx-5 h-[300px]">drone img</div>
          </div>
          <div className="flex h-[400px] w-2/5 flex-col gap-3">
            <div className="flex flex-col justify-around gap-1 h-2/5">
              <div className="flex items-center">
                <div className="mx-2 my-2">
                  <img
                    src="/icons/time.png"
                    alt="Button Icon"
                    className="object-contain"
                  />
                </div>
                <h2>Flight time</h2>
              </div>
              <div className="h-[100px]">
                {/* 시간 데이터들 보여지는 부분*/}
              </div>
            </div>
            <div className="flex flex-col justify-around gap-1 h-3/5">
              <div className="flex items-center">
                <div className="mx-2 my-2">
                  <img
                    src="/icons/setting-error.png"
                    alt="Button Icon"
                    className="object-contain"
                  />
                </div>
                <h2>State</h2>
              </div>
              <div className="h-[170px]">
                {/* 상태 데이터들 보여지는 부분*/}
              </div>
            </div>
          </div>
        </div>
        <ChartCard title="chart1">{/* <TelemetryChart /> */}</ChartCard>
        <ChartCard title="chart2">
          <div />
        </ChartCard>
        <ChartCard title="chart3">
          <div />
        </ChartCard>
      </div>
    </>
  );
};

export default ChartPage;
