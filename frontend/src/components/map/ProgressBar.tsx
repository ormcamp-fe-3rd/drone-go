import { ReactNode, useContext } from "react";

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
  const { phase } = useContext(PhaseContext);

  // 상태 메시지 타임라인 정렬
  const sortedStates = stateData
    ? [...stateData].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    : [];

  // 현재 phase에 맞는 상태 메시지 찾기
  const currentIndex = Math.floor(phase * (sortedStates.length - 1));
  const currentState = sortedStates[currentIndex] || null;
  console.log(currentState)


  return (
    <div className="video-container mx-auto flex w-[80%] max-w-[800px]">
      <div className="progress-bar relative mb-[50px] h-[8px] w-full rounded-[5px] bg-[#504D4D]">
        <div className="progress transition-width absolute h-full w-0 bg-[#D7D7D7] duration-200 ease-linear"></div>

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