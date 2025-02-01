import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {AuthContext} from "@/contexts/AuthContext";

import { fetchTelemetriesByRobotAndOperation } from "../../api/chartApi";
import AltAndSpeedChart from "../../components/charts/AltAndSpeedChart";
import BatteryChart from "../../components/charts/BatteryChart";
import DetailedDataHeader from "../../components/charts/DetailedDataHeader";
import FlightTimeDataComponenet from "../../components/charts/FilghtTimeDataComponent";
import SatellitesChart from "../../components/charts/SatellitesChart";
import StateDataComponent from "../../components/charts/StateDataComponent";
import { Robot } from "../../types/selectOptionsTypes";

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  children,
}) => (
  <div className="h-[380px] rounded-[10px] border border-[#B2B2B7] bg-white pt-5">
    {children}
  </div>
);


const ChartPage: React.FC = () => {
  const location = useLocation();
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperationAndDate, setSelectedOperationAndDate] = useState<{
    operationId: string;
    date: string;
    name: string;
  } | null>(null);
  const { isAuth }  = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(isAuth === null) return;
    if(!isAuth){
      alert("Signing in is required");
      navigate("/");
    }
  },[isAuth, navigate])
  
  const droneImages: { [key: string]: string } = {
    M1_1: "/images/chart/drone1.svg",
    M1_2: "/images/chart/drone2.svg",
    M1_3: "/images/chart/drone1.svg",
  };

  // location에서 robot_id 가져오기
  const robotId = location.state?.robot_id;
  const name = location.state?.name;
  const _id = location.state?._id;

  //TODO:operation 값 최신 데이터 선택해야함
  // robot_id를 기반으로 selectedDrone 설정
  useEffect(() => {
    if (robotId) {
      // robotId로부터 Robot 객체 생성
      const drone: Robot = {
        _id: _id,
        name: name,
        robot_id: robotId,
      };
      setSelectedDrone(drone);

      //data 확인용용
      /*console.log("Selected Drone:", drone);
      console.log("선택된 드론:", drone);
      console.log("Selected Operation:", selectedOperation);*/
    }
  }, [robotId, name, _id]);

  // 데이터 요청
  const {
    data: telemetryData = {
      batteryData: [],
      textData: [],
      satellitesData: [],
      altAndSpeedData: [],
    },
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "telemetry",
      selectedDrone?._id,
      selectedOperationAndDate?.operationId,
    ],
    queryFn: () => {
      if (!selectedDrone || !selectedOperationAndDate) {
        return {
          batteryData: [],
          textData: [],
          satellitesData: [],
          altAndSpeedData: [],
        };
      }
      return fetchTelemetriesByRobotAndOperation(
        selectedDrone._id,
        selectedOperationAndDate.operationId,
      );
    },
    enabled: !!selectedDrone && !!selectedOperationAndDate, // 선택된 드론과 오퍼레이션 값이 있을 때만 API 호출
    staleTime: 60000, // 데이터 캐싱 시간 (1분)
  });

  if (error?.message === "Unauthorized user") {
    localStorage.removeItem("token");
    alert("Your session has expired. Please log in again.");
    window.location.href = "/";
    return null;
  }
  const { batteryData, textData, satellitesData, altAndSpeedData } = telemetryData;


  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F9]">
      <DetailedDataHeader
        backgroundOpacity={100}
        isMapPage={location.pathname === "/map"}
        selectedDrone={selectedDrone}
        setSelectedDrone={setSelectedDrone}
        selectedOperationAndDate={selectedOperationAndDate}
        setSelectedOperationAndDate={setSelectedOperationAndDate}
      />
      <div className="mx-10 mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* 드론 정보 카드 */}
        <div className="flex h-[380px] gap-3">
          <div className="flex w-3/5 flex-col rounded-[10px] border border-[#B2B2B7] bg-white">
            <h2 className="mx-10 my-5 text-2xl font-semibold">
              Name : {selectedDrone ? selectedDrone.name : "Select a Drone"}
            </h2>
            <div className="mx-5 h-[300px]">
              {selectedDrone ? (
                <img
                  src={`/images/chart/${selectedDrone._id}.svg`}
                  alt={selectedDrone.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <p className="text-xl text-gray-500">Select a drone</p>
              )}
            </div>
          </div>
          {/* 기타 데이터 카드 */}
          <div className="flex h-[380px] w-2/5 flex-col gap-3">
            <div className="flex h-2/5 flex-col justify-around gap-1 rounded-[10px] border border-[#B2B2B7] bg-white">
              <div className="flex items-center">
                <div className="mx-2 my-2">
                  <img
                    src="/icons/time.svg"
                    alt="Button Icon"
                    className="object-contain"
                  />
                </div>
                <h2 className="text-[16px] font-bold">Flight time</h2>
              </div>
              <div className="h-[100px]">
                {batteryData.length > 0 && (
                  <FlightTimeDataComponenet data={batteryData} />
                )}
              </div>
            </div>
            <div className="flex h-3/5 flex-col justify-around gap-1 rounded-[10px] border border-[#B2B2B7] bg-white">
              <div className="flex items-center">
                <div className="mx-2 my-2">
                  <img
                    src="/icons/setting-error.svg"
                    alt="Button Icon"
                    className="object-contain"
                  />
                </div>
                <h2 className="text-[16px] font-bold">State</h2>
              </div>
              <div className="mb-2 ml-3 h-[170px]">
                <StateDataComponent data={textData} />
              </div>
            </div>
          </div>
        </div>
        {/* 차트 */}
        {isLoading ? (
          <p>Loading chart data...</p>
        ) : error ? (
          <p>Error loading data</p>
        ) : (
          <>
            <BatteryChart data={batteryData} />
            <SatellitesChart data={satellitesData} />
          </>
        )}

        {isLoading ? (
          <ChartCard title="">
            <p className="text-center">Loading chart data...</p>
          </ChartCard>
        ) : error instanceof Error ? (
          <p className="text-center">Error loading data: {error.message}</p>
        ) : altAndSpeedData.length > 0 ? (
          <ChartCard title="">
            <AltAndSpeedChart data={altAndSpeedData} />
          </ChartCard>
        ) : (
          <ChartCard title="">
            <p className="text-center">
              <strong> Select a drone and operation to view the chart.</strong>
            </p>
          </ChartCard>
        )}

      </div>
    </div>
  );
};

export default ChartPage;
