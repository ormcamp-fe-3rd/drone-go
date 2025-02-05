import { ReactNode } from "react";


interface ProgressProps {
  children: ReactNode;
  startTime: string;
  endTime: string;
}

const ProgressBar = ({ children, startTime, endTime }: ProgressProps) => {

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