import { ReactNode, useContext,useState } from "react";

import { PhaseContext } from "@/contexts/PhaseContext";

interface ProgressProps {
  children: ReactNode;
  startTime: string;
  endTime: string;
  stateData: {
    timestamp: Date;
    payload: {
      text: string;
    };
  }[] | null;
}

const ProgressBar = ({ children, startTime, endTime, stateData }: ProgressProps) => {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverState, setHoverState] = useState<string | null>(null);
  const { phase } = useContext(PhaseContext);

  // 상태 메시지 타임라인 정렬
  const sortedStates = stateData
    ? [...stateData].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    : [];

  // 타임스탬프 범위 설정
  const startTimestamp = sortedStates.length > 0 ? sortedStates[0].timestamp.getTime() : 0;
  const endTimestamp = sortedStates.length > 0 ? sortedStates[sortedStates.length - 1].timestamp.getTime() : 1;
  const totalDuration = endTimestamp - startTimestamp || 1; // 0으로 나누는 것 방지

  // 현재 phase에 맞는 상태 메시지 찾기
  const currentIndex = Math.floor(phase * (sortedStates.length - 1));
  const currentState = sortedStates[currentIndex] || null;
  console.log(currentState)

  // 프로그레스 바 상의 표시 위치 계산 (백분율 기반)
  const progressDots = sortedStates.map((state) => {
    const progressPercentage = ((state.timestamp.getTime() - startTimestamp) / totalDuration) * 100;
    return {
      progress: progressPercentage,
      state: state.payload.text,
    };
  });

  const handleHover = (time: number, state: string) => {
    setHoverTime(time);
    setHoverState(state);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setHoverState(null);
  };

  return (
    <div className="video-container mx-auto flex w-[80%] max-w-[800px]">
      <div className="progress-bar relative mb-[50px] h-[8px] w-full rounded-[5px] bg-[#504D4D]">
        <div className="progress transition-width absolute h-full w-0 bg-[#D7D7D7] duration-200 ease-linear"></div>

        {/* 상태 메시지 존재하는 위치에 점 표시 */}
        {progressDots.map((dot, index) => (
          <div
            key={index}
            className="drone-dot absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 transform cursor-pointer rounded-full bg-white z-10"
            style={{ left: `${dot.progress}%` }}
            onMouseEnter={() => handleHover(dot.progress, dot.state)}
            onMouseLeave={handleMouseLeave}
          >
            {/* 호버 시 상태 메시지 표시 */}
            {hoverTime === dot.progress && (
              <div className="absolute left-1/2 top-[20px] z-10 -translate-x-1/2 transform whitespace-nowrap rounded-[10px] bg-white bg-opacity-80 px-2 py-1 text-[12px] font-semibold text-[#28282C]">
                {hoverState}
              </div>
            )}
          </div>
        ))}

        {children}

        <div className="time-left absolute bottom-[-30px] left-0 -translate-x-1/2 transform text-[14px] text-black">
          {startTime}
        </div>

        <div className="time-right absolute bottom-[-30px] right-0 translate-x-1/2 transform text-[14px] text-black">
          {endTime}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
