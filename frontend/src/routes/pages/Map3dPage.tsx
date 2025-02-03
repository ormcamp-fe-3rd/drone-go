import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchPositionDataByOperation } from "@/api/mapApi";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";
import CesiumViewer3D from "@/components/map3d/CesiumViewer3D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import MiniMapWidget from "@/components/map3d/MiniMapWidget";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";
import { AuthContext } from "@/contexts/AuthContext";
import PhaseContextProvider from "@/contexts/PhaseContext";
import toolbarWidgetData from "@/data/toolbarWidgetData.json";
import { Robot } from "@/types/selectOptionsTypes";
import { formatAndSortPositionData } from "@/utils/formatPositionData";

export default function Map3dPage() {
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperationAndDate, setSelectedOperationAndDate] = useState<{
    operationId: string;
    date: string;
    name: string;
  } | null>(null);
  const { isAuth }  = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if(isAuth === null) return;
    if(!isAuth){
      alert("Signing in is required");
      navigate("/");
    }
  },[isAuth, navigate])


  const { error, data } = useQuery({
    queryKey: ["position", selectedDrone, selectedOperationAndDate],
    queryFn: async () => {
      if (!selectedDrone || !selectedOperationAndDate) return;
      const rawData = await fetchPositionDataByOperation(
        selectedDrone!._id,
        selectedOperationAndDate.operationId,
      );
      return formatAndSortPositionData(rawData);
    },
    enabled: !!selectedOperationAndDate,
  });

  if (error) {
    return "An error has occurred: " + error.message;
  }

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
          <MiniMapWidget positionData={data ?? null} />
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
        {/* <Map3D positionData={data ?? null} /> */}
        
        <CesiumViewer3D positionData={data?? []}/>
      </PhaseContextProvider>
    </>
  );
}
