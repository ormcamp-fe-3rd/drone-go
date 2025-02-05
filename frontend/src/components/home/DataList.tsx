import { useQuery } from "@tanstack/react-query";

import { fetchRobots } from "../../api/dropdownApi"; // API 함수 가져오기
import { FlightDataCard } from "./FlightDataCard";

const DroneList = () => {
  const {
    data: drones = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["robots"], // Query 캐싱 키
    queryFn: fetchRobots, // API 호출 함수
  });
  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="mx-auto mb-10 flex h-[1024px] flex-col items-center justify-center text-center">
      <p className="title" id="DataList">
        Select the Drone
      </p>
      <p className="subtitle mt-2">
        Select a drone and view its data visualization.
      </p>
      <div className="mt-10 flex h-auto min-h-[37.5rem] w-[75rem] flex-wrap items-center justify-center">
        {drones.map(
          (
            drone: { robot_id: string; name: string; img: string; _id: string },
            op: { robot: string },
          ) => (
            <FlightDataCard
              key={drone._id}
              name={drone.name}
              img={`/images/chart/${drone.name}.svg`}
              robot_id={drone.robot_id}
              _id={drone._id}
              robot={op.robot}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default DroneList;
