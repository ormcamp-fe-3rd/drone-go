import React from "react";
import { ProcessedTelemetryBatteryData } from "../../types/telemetryBatteryDataTypes";
import { formatTime } from "../../utils/formatTime";
import {
  differenceInMilliseconds,
  differenceInSeconds,
  format,
  intervalToDuration,
} from "date-fns";

interface FlightTimeDataProps {
  data: ProcessedTelemetryBatteryData[];
}

const FlightTimeDataComponenet: React.FC<FlightTimeDataProps> = ({ data }) => {
  //timestamp만 추출하여 오름차순 나열
  const sortedTimestamps = data
    .map((item) => new Date(item.timestamp))
    .sort((a, b) => a.getTime() - b.getTime());

  const flightStartTime = sortedTimestamps[0];
  const flightEndTime = sortedTimestamps[sortedTimestamps.length - 1];
  const formattedStartTime = formatTime(flightStartTime);
  const formattedEndTime = formatTime(flightEndTime);

  // 총 비행 시간 계산 (intervalToDuration 사용)
  const {
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = intervalToDuration({
    start: flightStartTime,
    end: flightEndTime,
  });

  // 총 비행 시간 포맷팅
  const formattedTotalFlightTime = [hours, minutes, seconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":");

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
