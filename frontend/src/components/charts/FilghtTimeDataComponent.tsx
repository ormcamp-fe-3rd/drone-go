import React from "react";
import { ProcessedTelemetryBatteryData } from "../../types/telemetryBatteryDataTypes"; // ProcessedTelemetryBatteryData 타입 임포트
import { formatTime } from "../../utils/formatTime";

interface FlightTimeDataProps {
  data: ProcessedTelemetryBatteryData[]; // ProcessedTelemetryBatteryData 배열을 props로 받음
}

const FlightTimeDataComponenet: React.FC<FlightTimeDataProps> = ({ data }) => {
  //timestamp만 추출하여 오름차순 나열
  const sortedTimestamps = data
    .map((item) => item.timestamp)
    .sort((a, b) => a.getTime() - b.getTime());

  const flightStartTime = sortedTimestamps[0];
  const flightEndTime = sortedTimestamps[sortedTimestamps.length - 1];
  const formattedStartTime = formatTime(flightStartTime);
  const formattedEndTime = formatTime(flightEndTime);

  //총 비행 시간 계산
  const totalFlightTimeMs = flightEndTime.getTime() - flightStartTime.getTime(); //밀리초 계산
  const totalFlightTimeH = Math.floor(totalFlightTimeMs / 3600000); //시간
  const totalFlightTimeM = Math.floor((totalFlightTimeMs % 3600000) / 60000); //분
  const totalFlightTimeS = Math.floor((totalFlightTimeMs % 60000) / 10000); //초

  const formattedTotalFlightTime = `${totalFlightTimeH.toString().padStart(2, "0")} : ${totalFlightTimeM.toString().padStart(2, "0")} : ${totalFlightTimeS.toString().padStart(2, "0")}`;

  return (
    <div className="flex-col justify-between h-full mx-3">
      <div className="flex items-center justify-between h-1/3">
        <h2 className="text-[16px] font-bold text-[#3F5D7E]">Start Time</h2>
        <p className="text-[16px] font-bold">{formattedStartTime}</p>
      </div>
      <div className="flex h-1/3 items-center justify-between border-b border-[#B2B2B7]">
        <h2 className="text-[16px] font-bold text-[#3F5D7E]">End Time</h2>
        <p className="text-[16px] font-bold">{formattedEndTime}</p>
      </div>
      <div className="flex items-center justify-between h-1/3">
        <h2 className="text-[16px] font-bold text-[#3F5D7E]">Total Time</h2>
        <p className="text-[16px] font-bold">{formattedTotalFlightTime}</p>
      </div>
    </div>
  );
};

export default FlightTimeDataComponenet;
