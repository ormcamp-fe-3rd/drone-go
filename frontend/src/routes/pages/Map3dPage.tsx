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
import { MSG_ID } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { CurrentTimeProvider } from "@/contexts/CurrentTimeContext";
import PhaseContextProvider from "@/contexts/PhaseContext";
import SelectedDataContext from "@/contexts/SelectedDataContext";
import { useTelemetry2D } from "@/hooks/useTelemetry2D";
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

  const { data, error, isLoading } = useTelemetry2D(
    selectedDrone,
    selectedOperationAndDate,
  );

  useEffect(()=>{
    const rawPositionData =
      data?.filter((entry) => entry.msgId === MSG_ID.GLOBAL_POSITION) ?? [];
    setPositionData(
      rawPositionData.length > 0
        ? formatAndSortPositionData(rawPositionData)
        : null);
    const rawStateData =
      data?.filter((entry) => entry.msgId === MSG_ID.STATUSTEXT) ?? [];
    setStateData(rawStateData.length > 0 ? rawStateData : null);


  },[is2dMap, data])
  if (error) {
    return "An error has occurred: " + error.message;
  }

  // 속도데이터
  const rawSpeedData = data?.filter((entry) => entry.msgId === MSG_ID.VFR_HUD) ?? [];
  const speedData = rawSpeedData.length > 0 ? rawSpeedData : null;

  //헤딩 데이터
  const rawHeadingData = data?.filter((entry) => entry.msgId === MSG_ID.VFR_HUD) ?? [];
  const headingData = rawHeadingData.length > 0 ? rawHeadingData : null;

  //드론 모습 상세 데이터"roll", "pitch", "yaw"
  const rawAttitudeData =
    data?.filter((entry) => entry.msgId === MSG_ID.ATTITUDE) ?? [];
  const attitudeData = rawAttitudeData.length > 0 ? rawAttitudeData : null;

  //배터리 데이터
  const rawbatteryRemainingData =
    data?.filter((entry) => entry.msgId === MSG_ID.BATTERY_STATUS) ?? [];
  const batteryRemainingData =
    rawbatteryRemainingData.length > 0 ? rawbatteryRemainingData : null;

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
          <div className="fixed left-4 top-[11rem] z-10">
            {is2dMap ? (
              <AttitudeWidget
                headingData={headingData}
                batteryRemainingData={batteryRemainingData}
                attitudeData={attitudeData}
              />
            ) : (
              <MiniMapWidget positionData={positionData} />
            )}
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
          {is2dMap ? (
            <Map2D positionData={positionData} />
          ) : (
            <CesiumViewer3D positionData={positionData} />
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
