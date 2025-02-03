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
import { MSG_ID } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import PhaseContextProvider from "@/contexts/PhaseContext";
import SelectedDataContext from "@/contexts/SelectedDataContext";
import { useTelemetry2D } from "@/hooks/useTelemetry2D";
import { formatAndSortPositionData } from "@/utils/formatPositionData";

export default function Map3dPage() {
  const {
    selectedDrone,
    selectedOperationAndDate,
  } = useContext(SelectedDataContext);
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

  const { data, error } = useTelemetry2D(
    selectedDrone,
    selectedOperationAndDate,
  );

  if (error) {
    return "An error has occurred: " + error.message;
  }

  // 속도데이터
  const rawSpeedData = data?.filter((entry) => entry.msgId === MSG_ID.VFR_HUD) ?? [];
  const speedData = rawSpeedData.length > 0 ? rawSpeedData : null;

  // 위치데이터
  const rawPositionData = data?.filter((entry) => entry.msgId === MSG_ID.GLOBAL_POSITION) ?? [];
  const positionData =
    rawPositionData.length > 0
      ? formatAndSortPositionData(rawPositionData)
      : null;
      
  // 상태데이터
  const rawStateData = data?.filter((entry) => entry.msgId === MSG_ID.STATUSTEXT) ?? [];
  const stateData = rawStateData.length > 0 ? rawStateData : null;

  const switchMap = () =>{
    setIs2dMap(!is2dMap);
  }

  //TODO: 라우트 수정("/map-3d" 삭제, "/map" 으로 연결)
  return (
    <>
      <PhaseContextProvider>
        <div className="fixed z-10 w-full">
          <DetailedDataHeader
            backgroundOpacity={60}
            isMapPage={true}
            //TODO: 지도에서 export 기능, 버튼 삭제
            exportToExcel={()=>null} />
        </div>
        <div className="fixed right-10 top-[10rem] z-10">
          <MapSwitchButton is2d={is2dMap} switchMap={switchMap} />
        </div>
        <div className="fixed left-4 top-[10rem] z-10">
          {is2dMap ? 
            <AttitudeWidget></AttitudeWidget>
          : <MiniMapWidget positionData={positionData} />
          }
          <WeatherWidget positionData={positionData} />

          <SpeedWidget speedData={speedData} />

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
        {is2dMap? 
          <Map2D 
            positionData={positionData} 
            stateData={stateData}/>
          :
          <CesiumViewer3D positionData={positionData} stateData={stateData}/>
        }
      </PhaseContextProvider>
    </>
  );
}
