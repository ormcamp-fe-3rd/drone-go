import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HeaderChartBtns from "@/components/charts/HeaderChartBtns";
import LoadingMessage from "@/components/map3d/LoadingMessage";
import { AuthContext } from "@/contexts/AuthContext";
import SelectedDataContext from "@/contexts/SelectedDataContext";

import { fetchTelemetriesByRobotAndOperation } from "../../api/chartApi";
import AltAndSpeedChart from "../../components/charts/AltAndSpeedChart";
import BatteryChart from "../../components/charts/BatteryChart";
import DetailedDataHeader from "../../components/charts/DetailedDataHeader";
import exportToExcel from "../../components/charts/ExportToExcel";
import FlightTimeDataComponenet from "../../components/charts/FilghtTimeDataComponent";
import SatellitesChart from "../../components/charts/SatellitesChart";
import StateDataComponent from "../../components/charts/StateDataComponent";
import { Robot } from "../../types/selectOptionsTypes";

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-[280px] flex-1 rounded-[10px] border border-[#B2B2B7] bg-white pb-2 pt-5">
    {children}
  </div>
);

const ChartPage: React.FC = () => {
  const location = useLocation();
  const { selectedDrone, selectedOperationAndDate, setSelectedDrone } =
    useContext(SelectedDataContext);
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth === null) return;
    if (!isAuth) {
      alert("Signing in is required");
      navigate("/");
    }
  }, [isAuth, navigate]);

  // location에서 robot_id 가져오기
  const robotId = location.state?.robot_id;
  const name = location.state?.name;
  const _id = location.state?._id;

  // robot_id를 기반으로 selectedDrone 설정
  useEffect(() => {
    if (robotId) {
      // robotId로부터 Robot 객체 생성
      const drone: Robot = {
        _id: _id,
        name: name,
        robot_id: robotId,
      };
      setSelectedDrone(drone)
    }
  }, [robotId, name, _id, setSelectedDrone]);

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

  const { batteryData, textData, satellitesData, altAndSpeedData } =
    telemetryData;

  // 에러나 로딩 상태에 대한 UI 개선
  const renderChartCard = (
    isLoading: boolean,
    error: any,
    data: any,
    Component: React.ReactNode,
  ) => {
    if (isLoading) {
      return (
        <ChartCard title="">
          <p className="text-center">Loading chart data...</p>
        </ChartCard>
      );
    }
    if (error) {
      return (
        <ChartCard title="">
          <p className="text-center">Error loading data: {error.message}</p>
        </ChartCard>
      );
    }
    if (data.length > 0) {
      return <ChartCard title="">{Component}</ChartCard>;
    }
    return (
      <ChartCard title="">
        <p className="text-center">
          <strong>Select a drone and operation to view the chart.</strong>
        </p>
      </ChartCard>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F9]">
      <DetailedDataHeader backgroundOpacity={100}>
        <HeaderChartBtns exportToExcel={() =>
          exportToExcel(
            batteryData,
            textData,
            satellitesData,
            altAndSpeedData,
            selectedDrone?.name ?? null,
            selectedOperationAndDate?.name ?? null,
          )
        } />
      </DetailedDataHeader>
      <div className="mx-10 mb-4 grid min-h-0 flex-grow grid-cols-1 gap-3 lg:grid-cols-2 lg:grid-rows-2">
        {/* 드론 정보 카드 */}
        <div className="flex min-h-[280px] gap-3">
          <div className="flex w-3/5 flex-col overflow-hidden rounded-[10px] border border-[#B2B2B7] bg-white">
            <h2 className="mx-10 my-5 text-2xl font-semibold">
              Name : {selectedDrone ? selectedDrone.name : "Select a Drone"}
            </h2>
            <div className="mx-5 flex-1 overflow-hidden">
              {selectedDrone ? (
                <img
                  src={`/images/chart/${selectedDrone.name}.svg`}
                  alt={selectedDrone.name}
                  className="h-full w-auto object-contain"
                />
              ) : (
                <p className="text-xl text-gray-500">Select a drone</p>
              )}
            </div>
          </div>
          {/* 기타 데이터 카드 */}
          <div className="flex h-full w-2/5 flex-col gap-2">
            <div className="flex h-[40%] flex-col gap-[1px] overflow-hidden rounded-[10px] border border-[#B2B2B7] bg-white">
              <div className="flex flex-shrink-0 items-center">
                <div className="mx-2 my-[6px]">
                  <img
                    src="/icons/time.svg"
                    alt="Button Icon"
                    className="object-contain"
                  />
                </div>
                <h2 className="text-[16px] font-bold">Flight time</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {batteryData.length > 0 && (
                  <FlightTimeDataComponenet data={batteryData} />
                )}
              </div>
            </div>
            <div className="flex h-[60%] flex-col gap-1 overflow-hidden rounded-[10px] border border-[#B2B2B7] bg-white">
              <div className="flex flex-shrink-0 items-center">
                <div className="mx-2 my-[6px]">
                  <img
                    src="/icons/setting-error.svg"
                    alt="Button Icon"
                    className="object-contain"
                  />
                </div>
                <h2 className="text-[16px] font-bold">State</h2>
              </div>
              <div className="mb-2 ml-3 max-h-[280px] min-h-0 flex-1 overflow-y-auto">
                <StateDataComponent data={textData} />
              </div>
            </div>
          </div>
        </div>
        {renderChartCard(
          isLoading,
          error,
          altAndSpeedData,
          <BatteryChart data={batteryData} />,
        )}
        {renderChartCard(
          isLoading,
          error,
          satellitesData,
          <SatellitesChart data={satellitesData} />,
        )}
        {renderChartCard(
          isLoading,
          error,
          altAndSpeedData,
          <AltAndSpeedChart data={altAndSpeedData} />,
        )}
        {isLoading && <LoadingMessage />}
      </div>
    </div>
  );
};

export default ChartPage;
