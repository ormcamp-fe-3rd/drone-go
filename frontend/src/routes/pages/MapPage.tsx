import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Robot } from "@/types/selectOptionsTypes";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";
import AttitudeWidget from "@/components/map3d/AttitudeWidget";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";
import { BatteryState, HeadingState } from "@/components/map3d/Widget";
import toolbarWidgetData from "@/data/toolbarWidgetData.json";
import { useTelemetry2D } from "@/hooks/useTelemetry2D";
import { formatAndSortPositionData } from "@/utils/formatPositionData";

export default function MapPage() {
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperationAndDate, setSelectedOperationAndDate] = useState<{
    operationId: string;
    date: string;
    name: string;
  } | null>(null);
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
  const { data, error, isPending } = useTelemetry2D(selectedDrone, selectedOperationAndDate);

  if (error) {
    if (error.message === "Unauthorized user") {
      localStorage.removeItem("token");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/";
      return null;
    }
    return "An error has occurred: " + error.message;
  }

  // 속도데이터
  const rawSpeedData = data?.filter((entry) => entry.msgId === 74) ?? [];
  const speedData = rawSpeedData.length > 0 ? rawSpeedData : null; 

  // 위치데이터
  const rawPositionData = data?.filter((entry) => entry.msgId === 33) ?? [];
  const positionData =
    rawPositionData.length > 0 ? formatAndSortPositionData(rawPositionData) : null;

  return (
    <>
      <div className="fixed z-10 w-full">
        <DetailedDataHeader
          backgroundOpacity={60}
          isMapPage={true}
          selectedDrone={selectedDrone}
          setSelectedDrone={setSelectedDrone}
          selectedOperationAndDate={selectedOperationAndDate}
          setSelectedOperationAndDate={setSelectedOperationAndDate}
        />
      </div>
      <div className="fixed right-10 top-[10rem] z-10">
        <MapSwitchButton />
      </div>
      <div className="fixed left-4 top-[10rem] z-10">
        <WeatherWidget
          icon={toolbarWidgetData[0].icon}
          title={toolbarWidgetData[0].title}
          values={toolbarWidgetData[0].dataValues as string[]}
        />
        <SpeedWidget speedData={speedData ?? null} />
      
        <AltitudeWidget positionData={positionData ?? null} />
        <StateWidget
          icon={toolbarWidgetData[3].icon}
          title={toolbarWidgetData[3].title}
          values={toolbarWidgetData[3].stateValues!}
        />
      </div>

      <Map2D positionData={positionData ?? null} />
    </>
  );
}