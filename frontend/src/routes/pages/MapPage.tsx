import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchPositionDataByOperation } from "@/api/mapApi";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import AltitudeWidget from "@/components/map3d/AltitudeWidget";
import AttitudeWidget from "@/components/map3d/AttitudeWidget";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import SpeedWidget from "@/components/map3d/SpeedWidget";
import StateWidget from "@/components/map3d/StateWidget";
import WeatherWidget from "@/components/map3d/WeatherWidget";
import { BatteryState, HeadingState } from "@/components/map3d/Widget";
import {AuthContext} from "@/contexts/AuthContext";
import toolbarWidgetData from "@/data/toolbarWidgetData.json"
import { Robot } from "@/types/selectOptionsTypes";
import { formatAndSortPositionData } from "@/utils/formatPositionData";

export default function MapPage() {
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperationAndDate, setSelectedOperationAndDate] = useState<{
    operationId: string;
    date: string;
    name: string;
  } | null>(null);
  const { isAuth }  = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(!token){
      alert("Signing in is required");
      navigate("/");
    }
  },[isAuth, navigate])
  

  const { error, data, isPending } = useQuery({
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

  // if (isPending) return "Loading...";
  if (error) {
    if (error.message === "Unauthorized user") {
      localStorage.removeItem("token");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/";
      return null;
    }
    return "An error has occurred: " + error.message;
  }

  // // 데이터가 있을 경우, heading을 기준으로 정렬, 없으면 0으로 설정
  // const sortedData = data?.filter((item) => item?.heading != null); // heading이 null인 값은 필터링
  // const currentHeading =
  //   sortedData && sortedData.length > 0
  //     ? (sortedData[sortedData.length - 1].heading ?? 0) // null이면 0으로 설정
  //     : 0; // sortedData가 없거나 비어있을 경우 0으로 설정

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
        {/* 위젯 props들 API 데이터로 수정 */}
        {/* <AttitudeWidget>
          <BatteryState />
          <HeadingState />
        </AttitudeWidget> */}
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
    </>
  );
}
