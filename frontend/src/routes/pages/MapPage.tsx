import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getTelemetries } from "@/api/generatedClient";

import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import { AttitudeWidget, BatteryState, HeadingState, SpeedAltitudeWidget, StateAlertWidget, WeatherWidget } from "@/components/map3d/Widget";
import toolbarWidgetData from "@/data/toolbarWidgetData.json";
import { Operation, Robot } from "@/types/selectOptionsTypes";
import formatPositionData from "@/utils/formatPositionData";

export default function MapPage() {
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);

  // 데이터 요청
  const { isLoading, error, data } = useQuery({
    queryKey: ["position", selectedDrone, selectedOperation],
    queryFn: async () => {
      if (!selectedDrone || !selectedOperation) return [];

      const { data: rawData } = await getTelemetries({
        robotId: selectedDrone._id!,
        operationId: selectedOperation._id!,
      });

      return (rawData || []).map((item) => formatPositionData(item));
    },
    enabled: !!selectedDrone && !!selectedOperation,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <>
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
      <div className="fixed right-10 top-[10rem] z-10">
        <MapSwitchButton />
      </div>
      <div className="fixed left-4 top-[10rem] z-10">
        {/* 위젯들 */}
        <AttitudeWidget>
          <BatteryState />
          <HeadingState />
        </AttitudeWidget>
        <WeatherWidget
          icon={toolbarWidgetData[0].icon}
          title={toolbarWidgetData[0].title}
          values={toolbarWidgetData[0].dataValues as string[]}
        />
        <SpeedAltitudeWidget
          icon={toolbarWidgetData[1].icon}
          title={toolbarWidgetData[1].title}
          value={toolbarWidgetData[1].dataValues![0]}
        />
        <SpeedAltitudeWidget
          icon={toolbarWidgetData[2].icon}
          title={toolbarWidgetData[2].title}
          value={toolbarWidgetData[2].dataValues![0]}
        />
        <StateAlertWidget
          icon={toolbarWidgetData[3].icon}
          title={toolbarWidgetData[3].title}
          values={toolbarWidgetData[3].stateValues!}
        />
      </div>

      {/* 지도 */}
      <Map2D formatPositionData={data ?? []} />
    </>
  );
}
