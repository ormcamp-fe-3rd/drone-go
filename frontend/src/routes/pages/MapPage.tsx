import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";

import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";

import { BatteryState, HeadingState } from "@/components/map3d/Widget";
import { AuthContext } from "@/contexts/AuthContext";
import SelectedDataContext from "@/contexts/SelectedDataContext";

import { useTelemetry2D } from "@/hooks/useTelemetry2D";
import { formatAndSortPositionData } from "@/utils/formatPositionData";
import AttitudeWidget from "@/components/map3d/AttitudeWidget";

export default function MapPage() {
  const {
    selectedDrone,
    selectedOperationAndDate,
  } = useContext(SelectedDataContext);
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth === null) return;
    if (!isAuth) {
      alert("Signing in is required");
      navigate("/");
    }
  }, [isAuth, navigate]);

  // useTelemetry2D 훅을 사용하여 데이터 가져오기
  const { data, error, isPending } = useTelemetry2D(
    selectedDrone,
    selectedOperationAndDate,
  );

  if (error) {
    return "An error has occurred: " + error.message;
  }

  // 속도데이터
  const rawSpeedData = data?.filter((entry) => entry.msgId === 74) ?? [];
  const speedData = rawSpeedData.length > 0 ? rawSpeedData : null;

  //헤딩 데이터
  const rawHeadingData = data?.filter((entry) => entry.msgId === 74) ?? [];
  const headingData = rawHeadingData.length > 0 ? rawHeadingData : null;

  //드론 모습 상세 데이터"roll", "pitch", "yaw"
  const rawRollData = data?.filter((entry) => entry.msgId === 30) ?? [];
  const rollData = rawRollData.length > 0 ? rawRollData : null;

  const rawpitchData = data?.filter((entry) => entry.msgId === 30) ?? [];
  const pitchData = rawpitchData.length > 0 ? rawpitchData : null;

  const rawyawData = data?.filter((entry) => entry.msgId === 30) ?? [];
  const yawData = rawRollData.length > 0 ? rawRollData : null;

  //배터리리 데이터
  const rawbatteryRemainingData =
    data?.filter((entry) => entry.msgId === 147) ?? [];
  const batteryRemainingData =
    rawbatteryRemainingData.length > 0 ? rawbatteryRemainingData : null;

  // 위치데이터
  const rawPositionData = data?.filter((entry) => entry.msgId === 33) ?? [];
  const positionData =

    rawPositionData.length > 0
      ? formatAndSortPositionData(rawPositionData)
      : null;


  // 상태데이터
  const rawStateData = data?.filter((entry) => entry.msgId === 253) ?? [];
  const stateData = rawStateData.length > 0 ? rawStateData : null;

  return (
    <>
      <div className="fixed z-10 w-full">
        <DetailedDataHeader
          backgroundOpacity={60}
          isMapPage={true}
          exportToExcel={() => null}
        />
      </div>
      <div className="fixed right-10 top-[10rem] z-10">
        {/* <MapSwitchButton /> */}
      </div>
      <div className="fixed left-4 top-[10rem] z-10">
        <AttitudeWidget
          headingData={headingData ?? null}
          batteryRemainingData={batteryRemainingData ?? null}
          rollData={rollData ?? null}
          pitchData={pitchData ?? null}
          yawData={yawData ?? null}
        />
        <WeatherWidget positionData={positionData ?? null} />

        <SpeedWidget speedData={speedData ?? null} />

        <AltitudeWidget positionData={positionData ?? null} />

        <StateWidget
          stateData={stateData ?? null}
          selectedDrone={selectedDrone ? selectedDrone._id : null}

          selectedOperationAndDate={
            selectedOperationAndDate
              ? selectedOperationAndDate.operationId
              : null
          }

        />
      </div>

      <Map2D
        positionData={positionData ?? null}
        stateData={stateData ?? null}
      />
    </>
  );
}
