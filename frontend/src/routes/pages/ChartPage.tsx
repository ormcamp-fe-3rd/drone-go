import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "@/contexts/AuthContext";
import SelectedDataContext from "@/contexts/SelectedDataContext";

import { useTelemetryChart } from "@/hooks/useTelemetryChart";
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
  <div className="h-[380px] rounded-[10px] border border-[#B2B2B7] bg-white pt-5">
    {children}
  </div>
);

const ChartPage: React.FC = () => {
  const location = useLocation();
  const { selectedDrone, selectedOperationAndDate, setSelectedDrone } = useContext(SelectedDataContext);
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
      const drone: Robot = {
        _id: _id,
        name: name,
        robot_id: robotId,
      };
      setSelectedDrone(drone);
    }
  }, [robotId, name, _id, setSelectedDrone]);

  // 데이터 요청
  const { data, error } = useTelemetryChart(selectedDrone, selectedOperationAndDate);
  
  if (error) {
    return "An error has occurred: " + error.message;
  }

  // msgId 별 데이터 할당
  const {
    GPS_RAW_INT: satellitesData, // 위성 수
    BATTERY_STATUS: batteryData, // 배터리 정보
    STATUSTEXT: textData, // 상태 메시지
    altAndSpeedData, // 고도, 속도 합산
  } = data ?? {};

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F9]">
      <DetailedDataHeader
        backgroundOpacity={100}
        isMapPage={location.pathname === "/map"}
        exportToExcel={() =>
          exportToExcel(
            batteryData ?? [],
            textData ?? [],
            satellitesData ?? [],
            altAndSpeedData,
            selectedDrone?.name ?? null,
            selectedOperationAndDate?.name ?? null,
          )
        }
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
                  src={`/images/chart/${selectedDrone.name}.svg`}
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
              {batteryData && batteryData.length > 0 ? (
                <FlightTimeDataComponenet data={batteryData} />
              ) : (
                <p>No battery data available.</p> // 배터리 데이터가 없을 때 표시할 메시지
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
                <StateDataComponent data={textData ?? []} />
              </div>
            </div>
          </div>
        </div>

        {/* 차트들 */}
        {altAndSpeedData?.length > 0 && (
          <>
            <ChartCard title="Alt and Speed Data">
              <AltAndSpeedChart data={altAndSpeedData} />
            </ChartCard>
            <ChartCard title="Battery Data">
              <BatteryChart data={batteryData ?? []} />
            </ChartCard>
            <ChartCard title="Satellites Data">
              <SatellitesChart data={satellitesData ?? []} />
            </ChartCard>
          </>
        )}
        {/* 데이터를 선택하지 않았거나 로딩 중일 때 표시 */}
        {(!altAndSpeedData || altAndSpeedData.length === 0) && (
          <ChartCard title="">
            <p className="text-center">
              <strong>Select a drone and operation to view the chart.</strong>
            </p>
          </ChartCard>
        )}
      </div>
    </div>
  );
};

export default ChartPage;
