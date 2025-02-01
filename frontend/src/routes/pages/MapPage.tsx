import { useState, useEffect } from "react";
import { useTelemetryData } from "@/api/telemetryData";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";
import AttitudeWidget from "@/components/map3d/AttitudeWidget";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";
import PhaseContextProvider from "@/contexts/PhaseContext";
import toolbarWidgetData from "@/data/toolbarWidgetData.json";
import { Operation, Robot } from "@/types/selectOptionsTypes";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

export default function MapPage() {
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);

  // 데이터 요청
  const { data: telemetryData, error, isLoading } = useTelemetryData(
    selectedDrone?._id ?? "",
    selectedOperation?._id ?? ""
  );

  const positionData: FormattedTelemetryPositionData[] =
  telemetryData?.position?.map((data) => ({
    msgId: data.msgId,
    timestamp: data.timestamp,
    formattedTime: data.formattedTime,
    payload: {
      lat: data.lat ?? 0,
      lon: data.lon ?? 0,
      alt: data.alt ?? 0,
    },
  })) ?? [];


  const speedData = telemetryData?.speed?.[0]?.groundspeed ?? 0;
  const attitudeData = telemetryData?.orientation ?? [];

  useEffect(() => {
    console.log("📡 Selected Drone:", selectedDrone);
    console.log("🚀 Selected Operation:", selectedOperation);
    console.log("📍 Telemetry Data:", telemetryData);
    console.log("📌 Position Data:", positionData);
    console.log("💨 Speed Data:", speedData);
    console.log("🌀 Attitude Data:", attitudeData);
  }, [telemetryData, selectedDrone, selectedOperation]);

  return (
    <PhaseContextProvider>
      
      {isLoading ? (
        <p className="text-center text-gray-500 mt-10">📡 Loading telemetry data...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-10">⚠️ Error: {error.message}</p>
      ) : (
        <>
          {/* 헤더 */}
          <div className="fixed z-10 w-full">
            <DetailedDataHeader
              backgroundOpacity={60}
              isMapPage={true}
              selectedDrone={selectedDrone}
              setSelectedDrone={setSelectedDrone}
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
            />
          </div>

          {/* 2D / 3D 지도 전환 버튼 */}
          <div className="fixed right-10 top-[10rem] z-10">
            <MapSwitchButton />
          </div>

          {/* 위젯 */}
          <div className="fixed left-4 top-[10rem] z-10 space-y-4">
            <AttitudeWidget />
            <WeatherWidget
              icon={toolbarWidgetData[0].icon}
              title={toolbarWidgetData[0].title}
              values={toolbarWidgetData[0].dataValues ?? []}
            />
            <SpeedWidget icon={toolbarWidgetData[1].icon} title="Speed" value={speedData} />
            <AltitudeWidget positionData={positionData} />
            <StateWidget
              icon={toolbarWidgetData[3].icon}
              title={toolbarWidgetData[3].title}
              values={toolbarWidgetData[3].stateValues ?? []}
            />
          </div>

          {/* 지도 */}
          <Map2D positionData={positionData} />
        </>
      )}
    </PhaseContextProvider>
  );
}
