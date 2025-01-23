import { useState } from "react";

import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map3D from "@/components/map3d/Map3D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import { AttitudeWidget, BatteryState, HeadingState, SpeedAltitudeWidget, StateAlertWidget, WeatherWidget } from "@/components/map3d/Widget";
import toolbarWidgetData from "@/data/toolbarWidgetData.json"
import { Operation,Robot } from "@/types/selectOptionsTypes";


export default function Map3dPage(){
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
      null,
  );

  //TODO: 데이터 연결후 재생성
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

        {/* TODO: 위젯 props들 api 데이터로 수정 */}
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
      <Map3D />
    </>
  );
}