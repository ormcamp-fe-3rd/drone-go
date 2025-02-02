import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Map2D from "@/components/map/Map2D";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";
import AttitudeWidget from "@/components/map3d/AttitudeWidget";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";
import { BatteryState, HeadingState } from "@/components/map3d/Widget";
import { AuthContext } from "@/contexts/AuthContext";
import PhaseContextProvider from "@/contexts/PhaseContext";
import toolbarWidgetData from "@/data/toolbarWidgetData.json";
import { Robot } from "@/types/selectOptionsTypes";
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

  const { data: telemetryData, error, isLoading } = useTelemetry2D(selectedDrone, selectedOperationAndDate);

  if (isLoading) return <p>Loading telemetry data...</p>;
  console.log("📌 useTelemetry2D 데이터 로딩 상태:", { isLoading, error, telemetryData });

  if (error) {
    if (error.message === "Unauthorized user") {
      localStorage.removeItem("token");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/";
      return null;
    }
    return `An error has occurred: ${error.message}`;
  }

  const rawPositionData = telemetryData?.filter((item) => item.msgId === 33) ?? [];
  const positionData = rawPositionData.length > 0 ? formatAndSortPositionData(rawPositionData) : null;

  return (
    <>
      <PhaseContextProvider>
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
          {/* <AttitudeWidget>
            <BatteryState />
            <HeadingState />
          </AttitudeWidget> */}
          <WeatherWidget
            icon={toolbarWidgetData[0].icon}
            title={toolbarWidgetData[0].title}
            values={toolbarWidgetData[0].dataValues ?? []} // undefined 방지
          />
          <SpeedWidget
            icon={toolbarWidgetData[1].icon}
            title={toolbarWidgetData[1].title}
            value={toolbarWidgetData[1].dataValues?.[0] ?? "N/A"} // undefined 방지
          />
          <AltitudeWidget positionData={positionData}/>
          <StateWidget
            icon={toolbarWidgetData[3].icon}
            title={toolbarWidgetData[3].title}
            values={toolbarWidgetData[3].stateValues ?? []} // undefined 방지
          />
        </div>
        <Map2D positionData={positionData ?? []} />
      </PhaseContextProvider>
    </>
  );
}
