import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchPositionDataByOperation } from "@/api/mapApi";
import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import { AttitudeWidget, BatteryState, HeadingState, SpeedAltitudeWidget, StateAlertWidget, WeatherWidget } from "@/components/map3d/Widget";
import {AuthContext} from "@/contexts/AuthContext";
import toolbarWidgetData from "@/data/toolbarWidgetData.json"
import { Operation,Robot } from "@/types/selectOptionsTypes";
import formatPositionData from "@/utils/formatPositionData";

export default function MapPage() {
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null,
  );
  const { isAuth }  = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(()=>{
    if(!isAuth){
      alert("Signing in is required");
      navigate("/");
    }
  },[isAuth, navigate])
  
  //TODO: drone id, operation id -> 사용자가 선택한 값으로 변경 

  const { isPending, error, data } = useQuery({
    queryKey: ["position", selectedDrone?._id, selectedOperation?._id],
    queryFn: async () => {
      if (!selectedDrone || !selectedOperation) return []; // 없으면 빈 배열 반환
      const rawData = await fetchPositionDataByOperation(
        selectedDrone._id,
        selectedOperation._id,
      );
      return rawData.map(formatPositionData);
    },
    // enabled: !!selectedDrone && !!selectedOperation, // 주석 해제
  });

  if (isPending) return "Loading...";
  if (error) {
    if (error.message === "Unauthorized user") {
      localStorage.removeItem("token");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/";
      return null;
    }
    return "An error has occurred: " + error.message;
  }

  // 데이터가 있을 경우, heading을 기준으로 정렬, 없으면 0으로 설정
  const sortedData = data?.filter((item) => item?.heading != null); // heading이 null인 값은 필터링
  const currentHeading =
    sortedData && sortedData.length > 0
      ? (sortedData[sortedData.length - 1].heading ?? 0) // null이면 0으로 설정
      : 0; // sortedData가 없거나 비어있을 경우 0으로 설정

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
        {/* 위젯 props들 API 데이터로 수정 */}
        <AttitudeWidget heading={currentHeading}>
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
      <Map2D latLonAltData={data} />
    </>
  );
}
