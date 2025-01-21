import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchPositionDataByOperation } from "@/api/mapApi";
import { fetchAttitudeDataByRobotAndOperation } from "@/api/mapToolbarApi";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import { Widget } from "@/components/map3d/Widget";
import toolbarWidgetData from "@/data/toolbarWidgetData.json"
import { Operation,Robot } from "@/types/selectOptionsTypes";
import formatPositionData from "@/utils/formatPositionData";
import { TelemetryAttitudeData } from "@/types/telemetryAttitudeDataTypes";


export default function MapPage(){
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
      null,
  );

  // const { isPending, error, data } = useQuery({
  //   queryKey: ["position", selectedDrone, selectedOperation],
  //   queryFn: async () => {
  //     const rawData = await fetchPositionDataByOperation(
  //       // selectedDrone!._id,
  //       // selectedOperation!._id,
  //       "67773116e8f8dd840dd35155",
  //       "677730f8e8f8dd840dd35153",
  //     );
  //     return rawData.map(formatPositionData);
  //   },
  //   // enabled: !!selectedDrone && !!selectedOperation,
  // });
  // if (isPending) return "Loading...";
  // if (error) return "An error has occurred: " + error.message;
  // console.log(data);

  const {
      data: attitudeData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["attitude", selectedDrone?._id, selectedOperation?._id],
      queryFn: () => {
        if (!selectedDrone || !selectedOperation) {
          return [];
        }
        return fetchAttitudeDataByRobotAndOperation(
          selectedDrone._id,
          selectedOperation._id,
        );
      },
      enabled: !!selectedDrone && !!selectedOperation,
      staleTime: 60000,
    });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  console.log(attitudeData);

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
        {/* 선택된 드론과 오퍼레이션을 AttitudeWidget에 전달 */}
        {selectedDrone && selectedOperation && (
          <Widget.AttitudeWidget
            robotId={selectedDrone._id}
            operationId={selectedOperation._id}
            attitudeData={attitudeData}
          />
        )}

        {/* TODO: 추후 목데이터 삭제 */}
        {selectedDrone && selectedOperation && (
          <Widget.WidgetBasic
            widgetData={toolbarWidgetData}
            robotId={selectedDrone._id}
            operationId={selectedOperation._id}
            attitudeData={attitudeData}
          />
        )}
      </div>
      <Map2D />
    </>
  );
}