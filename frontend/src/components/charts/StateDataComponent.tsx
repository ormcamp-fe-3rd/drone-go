import React from "react";
import { ProcessedTelemetryTextData } from "../../types/telemetryTextData";
import { formatTime } from "../../utils/formatTime";

interface FlightTextDataProps {
  data: ProcessedTelemetryTextData[];
}

const StateDataComponent: React.FC<FlightTextDataProps> = ({ data }) => {
  const sortedData = data.sort((a, b) => {
    const timestampA = new Date(a.timestamp).getTime();
    const timestampB = new Date(b.timestamp).getTime();
    return timestampA - timestampB;
  });

  return (
    <div className="scrollbar- max-h-full scroll-m-0 overflow-y-auto pr-3">
      <ul>
        {sortedData.map((item, index) => (
          <li key={index} className="mt-2">
            <p className="text-xs font-bold text-[#3F5D7E]">{item.text}</p>
            <p className="border-b border-[#B2B2B7] text-right text-[10px] font-bold text-[#3F5D7E]">
              {formatTime(item.timestamp)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StateDataComponent;
