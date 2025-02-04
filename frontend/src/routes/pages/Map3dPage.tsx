import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import HeaderMapBtns from "@/components/charts/HeaderMapBtns";
import Map2D from "@/components/map/Map2D";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";
import AttitudeWidget from "@/components/map3d/AttitudeWidget";
import CesiumViewer3D from "@/components/map3d/CesiumViewer3D";
import LoadingMessage from "@/components/map3d/LoadingMessage";
import MiniMapWidget from "@/components/map3d/MiniMapWidget";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";
import { AuthContext } from "@/contexts/AuthContext";
import { CurrentTimeProvider } from "@/contexts/CurrentTimeContext";
import PhaseContextProvider from "@/contexts/PhaseContext";
import SelectedDataContext from "@/contexts/SelectedDataContext";
import { useTelemetry2D, useFormattedPositionData } from "@/hooks/useTelemetry2D";
import { Telemetry2dData } from "@/types/telemetry2dDataTypes";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import { formatAndSortPositionData } from "@/utils/formatPositionData";


export default function Map3dPage() {
  const { selectedDrone, selectedOperationAndDate } =
    useContext(SelectedDataContext);
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [is2dMap, setIs2dMap] = useState(true);
  const [ positionData, setPositionData ] = useState<FormattedTelemetryPositionData[] | null>(null);
  const [ stateData, setStateData ] = useState<Telemetry2dData[] | null>(null);

  useEffect(() => {
    if (isAuth === null) return;
    if (!isAuth) {
      alert("Signing in is required");
      navigate("/");
    }
  }, [isAuth, navigate]);

  // 데이터 요청청
  const { data, error } = useTelemetry2D(selectedDrone, selectedOperationAndDate);

  // 위치 데이터(포맷팅팅)
  const positionData = useFormattedPositionData(selectedDrone, selectedOperationAndDate);
 
  if (error) {
    return "An error has occurred: " + error.message;
  }
 
  // ✅ msgId 별 데이터 할당
  const {
    ATTITUDE: attitudeData = null, // 드론 자세 정보 (roll, pitch, yaw)
    VFR_HUD: headingSpeedData = null, // 헤딩, 속도
    BATTERY_STATUS: batteryRemainingData = null, // 배터리 정보
    STATUSTEXT: stateData = null, // 상태 메시지
  } = data ?? {};

  const switchMap = () => {
    setIs2dMap(!is2dMap);
  };

  return (
    <>
      <div className="fixed z-10 w-full">
        <DetailedDataHeader backgroundOpacity={60}>
          <HeaderMapBtns is2d={is2dMap} switchMap={switchMap} />
        </DetailedDataHeader>
      </div>

      <CurrentTimeProvider>
        <PhaseContextProvider>
          <div className="fixed left-4 top-[10rem] z-10">
            {is2dMap ? (
              <AttitudeWidget
                headingSpeedData={headingSpeedData}
                batteryRemainingData={batteryRemainingData}
                attitudeData={attitudeData}
              />
            ) : (
              <MiniMapWidget positionData={positionData} />
            )}
            <WeatherWidget positionData={positionData} />

            <SpeedWidget headingSpeedData={headingSpeedData} />

            <AltitudeWidget positionData={positionData} />

            <StateWidget
              stateData={stateData}
              selectedDrone={selectedDrone ? selectedDrone._id : null}
              selectedOperationAndDate={
                selectedOperationAndDate
                  ? selectedOperationAndDate.operationId
                  : null
              }
            />
          </div>
          {is2dMap ? (
            <Map2D positionData={positionData} stateData={stateData} />
          ) : (
            <CesiumViewer3D positionData={positionData} stateData={stateData} />
          )}
          {!selectedOperationAndDate && 
            <div className="fixed flex h-screen w-screen items-center justify-center">
              <div className="pointer-events-none flex h-20 w-56 items-center rounded-2xl bg-white bg-opacity-90 drop-shadow-md">
                <p className="w-full text-center">
                  Please select an operation.
                </p>
              </div>
            </div>
          }
          {isLoading && 
            <LoadingMessage/>}
        </PhaseContextProvider>
      </CurrentTimeProvider>
    </>
  );
}
