import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// 오발로 생성한 클라이언트 임포트
import { getTelemetries, getGetTelemetriesUrl } from "@/api/generatedClient"; // 오발로 생성된 API 클라이언트를 임포트

import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map2D from "@/components/map/Map2D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
import { AttitudeWidget, BatteryState, HeadingState, SpeedAltitudeWidget, StateAlertWidget, WeatherWidget } from "@/components/map3d/Widget";
import toolbarWidgetData from "@/data/toolbarWidgetData.json";

// 오발에서 제공하는 Telemetry 타입을 가져옵니다.
import { Telemetry } from "@/api/generatedClient";  // 오발에서 자동 생성된 타입을 가져옴
import { TelemetryPositionData } from "@/types/telemetryPositionDataTypes";  // TelemetryPositionData 타입을 가져옵니다.

export default function MapPage() {
  const [selectedDrone, setSelectedDrone] = useState<any>(null); // any 또는 null로 처리
  const [selectedOperation, setSelectedOperation] = useState<any>(null); // any 또는 null로 처리

  // 리액트 쿼리로 데이터 요청
  const { isLoading, error, data } = useQuery({
    queryKey: ["position", selectedDrone, selectedOperation],
    queryFn: async () => {
      // 드론이나 오퍼레이션이 선택되지 않으면 빈 배열 반환
      if (!selectedDrone || !selectedOperation) {
        console.error("Missing required parameters: selectedDrone or selectedOperation");
        return [];
      }

      const params = {
        robotId: selectedDrone._id,  // selectedDrone._id로 요청
        operationId: selectedOperation._id,  // selectedOperation._id로 요청
        fields: "lat,lon,alt,timestamp,msgId,payload",  // 필요한 필드만 가져오기
      };

      try {
        // 텔레메트리 데이터 요청
        const { data: rawData } = await getTelemetries(params);

        // msgId가 33인 데이터만 필터링하고 필요한 데이터만 반환
        return (rawData ?? [])
          .filter((item: Telemetry) => item.msgId === 33) // msgId === 33 필터링
          .map((item: Telemetry): TelemetryPositionData => {
            // payload가 없을 경우 기본값 설정
            const payload = item?.payload ?? { lat: 0, lon: 0, alt: 0 }; // 기본값 설정

            // payload 필드가 undefined이면 기본값 처리
            return {
              lat: payload.lat ?? 0, // lat이 없으면 0으로 처리
              lon: payload.lon ?? 0, // lon이 없으면 0으로 처리
              alt: payload.alt ?? 0, // alt이 없으면 0으로 처리
              timestamp: item.timestamp ? new Date(item.timestamp) : new Date(), // timestamp 변환 (없으면 현재 시간으로 처리)
              payload: payload, // payload 기본값 설정
            };
          });
      } catch (err) {
        console.error("API Request Failed:", err); // API 요청 실패 시 출력
        return []; // 요청 실패 시 빈 배열 반환
      }
    },
    enabled: !!selectedDrone && !!selectedOperation, // 선택된 드론과 오퍼레이션이 있을 때만 요청
  });

  // 로딩 중
  if (isLoading) return <div>Loading...</div>;

  // 에러 발생 시
  if (error) {
    console.error("Error occurred:", error);
    return <div>An error has occurred: {error.message}</div>;
  }

  // 데이터가 없다면 경고 표시
  if (!data || data.length === 0) {
    console.warn("No telemetry data found.");
  }

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
