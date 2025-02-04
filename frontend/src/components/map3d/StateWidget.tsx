import { useEffect,useState } from "react";

import { useCurrentTime } from "@/contexts/CurrentTimeContext";
import { formatTime } from "@/utils/formatTime";

interface StateWidgetProps {
  stateData: {
    timestamp: Date;
    payload: {
      text: string;
    };
  }[] | null;
  selectedDrone: string | null;
  selectedOperationAndDate: string | null;
}

const StateWidget = ({ stateData, selectedDrone, selectedOperationAndDate }: StateWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<{ timestamp: Date; payload: { text: string } }[]>([]);
  
  const { currentTime } = useCurrentTime();
  
  const src = "/public/images/setting-error-03.svg";

  // 드론, 오퍼레이션 변경 시 상태 초기화
  useEffect(() => {
    setVisibleMessages([]);
  }, [selectedDrone, selectedOperationAndDate]);

  useEffect(() => {
    if (!stateData) return;
  
    // 최신순 정렬
    const sortedData = [...stateData].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
    // 현재 시간 ±1초 이내 메시지 필터링
    const newMessages = sortedData.filter(
      (item) => Math.abs(item.timestamp.getTime() - currentTime) < 1000
    );
  
    setVisibleMessages((prevMessages) => {
      // 기존 메시지와 새 메시지를 합치되, 중복 제거
      const mergedMessages = [...prevMessages, ...newMessages].filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.timestamp.getTime() === item.timestamp.getTime())
      );
  
    
      return mergedMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });
  }, [stateData, currentTime]);  

  const handleToggle = () => setIsExpanded((prev) => !prev);

  return (
    <div className={`relative mx-6 mt-2 hidden w-[30vw] max-w-[17rem] rounded-[10px] bg-white bg-opacity-90 px-2 text-center text-sm font-bold hover:bg-opacity-80 sm:block ${isExpanded ? "rounded-b-none" : ""}`}>
      <div className="flex h-[5vh] items-center justify-between">
        <div className="flex items-center">
          <img src={src} alt="State" />
          <p className="pl-2">State</p>
        </div>
        <button onClick={handleToggle} className="flex items-center">
          <img
            src={
              isExpanded
                ? "/public/images/togglebtn.svg"
                : "/public/images/Vector 17.svg"
            }
            alt={isExpanded ? "접기" : "펼치기"}
            className="h-4 w-4"
          />
        </button>
      </div>

      {/* 상태 메시지 렌더링 */}
      {isExpanded && (
        <div className="absolute left-0 top-full z-10 w-full max-h-[170px] overflow-y-auto rounded-b-[10px] bg-white bg-opacity-90 px-2 py-1">
          {visibleMessages.length > 0 ? (
            visibleMessages.map((item, index) => (
              <div key={index}>
                <div className="flex flex-col items-end text-right text-[12px] gap-1 py-1 text-[#3F5D7E]">
                  <div className="">{item.payload.text}</div>
                  <div className="ml-auto text-[10px]">{formatTime(item.timestamp)}</div>
                </div>
                {index !== visibleMessages.length - 1 && (
                  <div className="border-b border-[#B2B2B7]"></div>
                )}
              </div>
            ))
          ) : (
            <p className="py-2 text-[#3F5D7E]">No Data</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StateWidget;