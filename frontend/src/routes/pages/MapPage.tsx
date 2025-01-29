import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchPositionDataByOperation } from "@/api/mapApi";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";
import AttitudeWidget from "@/components/map3d/AttitudeWidget";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";
import PhaseContextProvider from "@/contexts/PhaseContext";
import toolbarWidgetData from "@/data/toolbarWidgetData.json"
import { Operation,Robot } from "@/types/selectOptionsTypes";
import { formatAndSortPositionData } from "@/utils/formatPositionData";


export default function MapPage(){
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
      null,
  );

  const { error, data } = useQuery({
    queryKey: ["position", selectedDrone, selectedOperation],
    queryFn: async () => {
      if (!selectedDrone || !selectedOperation) return;
      const rawData = await fetchPositionDataByOperation(
        selectedDrone!._id,
        selectedOperation!._id,
      );
      return formatAndSortPositionData(rawData);
    },
    enabled: !!selectedOperation,
  });
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <PhaseContextProvider>
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
          {/* TODO: 위젯 props들 api 데이터로 수정 */}
          <AttitudeWidget/>
          <WeatherWidget
            icon={toolbarWidgetData[0].icon}
            title={toolbarWidgetData[0].title}
            values={toolbarWidgetData[0].dataValues as string[]}
          />
          <SpeedWidget
            icon={toolbarWidgetData[1].icon}
            title={toolbarWidgetData[1].title}
            value={toolbarWidgetData[1].dataValues![0]}
          />
          <AltitudeWidget positionData={data ?? null} />
          <StateWidget
            icon={toolbarWidgetData[3].icon}
            title={toolbarWidgetData[3].title}
            values={toolbarWidgetData[3].stateValues!}
          />
        </div>
        <Map2D positionData={data ?? null} />
      </PhaseContextProvider>
    </>
  );
}