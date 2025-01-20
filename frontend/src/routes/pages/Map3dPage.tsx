import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchPositionDataByOperation } from "@/api/mapApi";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map3D from "@/components/map3d/Map3D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import { Widget } from "@/components/map3d/Widget";
import toolbarWidgetData from "@/data/toolbarWidgetData.json"
import { Operation,Robot } from "@/types/selectOptionsTypes";
import formatPositionData from "@/utils/formatPositionData";


export default function Map3dPage(){
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
      <div className="fixed right-10 top-[178px] z-10">
        <MapSwitchButton />
      </div>
      <div className="fixed left-4 top-[178px] z-10">
        <Widget.AttitudeWidget />

        {/* TODO: 추후 목데이터 삭제 */}
        <Widget.WidgetBasic widgetData={toolbarWidgetData} />
      </div>
      <Map3D />
    </>
  );
}