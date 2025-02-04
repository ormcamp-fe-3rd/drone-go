import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";
import AttitudeWidget from "@/components/map3d/AttitudeWidget";
import CesiumViewer3D from "@/components/map3d/CesiumViewer3D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import MiniMapWidget from "@/components/map3d/MiniMapWidget";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";
import { AuthContext } from "@/contexts/AuthContext";
import { CurrentTimeProvider } from "@/contexts/CurrentTimeContext";
import PhaseContextProvider from "@/contexts/PhaseContext";
import SelectedDataContext from "@/contexts/SelectedDataContext";
import { useTelemetry2D, useFormattedPositionData } from "@/hooks/useTelemetry2D";

export default function Map3dPage() {
  const { selectedDrone, selectedOperationAndDate } =
    useContext(SelectedDataContext);
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [is2dMap, setIs2dMap] = useState(true);

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

  //TODO: 라우트 수정("/map-3d" 삭제, "/map" 으로 연결)
  return (
    <>
      <div className="fixed z-10 w-full">
        <DetailedDataHeader
          backgroundOpacity={60}
          isMapPage={true}
          //TODO: 지도에서 export 기능, 버튼 삭제
          exportToExcel={() => null}
        />
      </div>
      <div className="fixed right-10 top-[10rem] z-10">
        <MapSwitchButton is2d={is2dMap} switchMap={switchMap} />
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
        </PhaseContextProvider>
      </CurrentTimeProvider>
    </>
  );
}
