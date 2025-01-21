import { ReactNode, useState } from "react";

interface DroneState {
  time: number;
  state: string;
}

interface ProgressProps{
  children: ReactNode
}
const Progress = ({children}: ProgressProps) => {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [droneState, setDroneState] = useState<string | null>(null);

  // 임시 데이터
  const droneStates: DroneState[] = [
    { time: 10, state: "Drone 1: Ready" },
    { time: 20, state: "Drone 2: Flying" },
    { time: 30, state: "Drone 3: Landed" },
  ];

  const handleHover = (time: number) => {
    const state = droneStates.find((state) => state.time === time);
    if (state) {
      setHoverTime(time);
      setDroneState(state.state);
    }
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setDroneState(null);
  };

  return (
    <div className="video-container mx-auto flex w-[80%] max-w-[800px]">
      <div className="progress-bar relative mb-[50px] h-[8px] w-full rounded-[5px] bg-[#504D4D]">
        <div className="progress transition-width absolute h-full w-0 bg-[#D7D7D7] duration-200 ease-linear"></div>

        {droneStates.map((state, index) => (
          <div
            key={index}
            className="drone-dot absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 transform cursor-pointer rounded-full bg-white"
            style={{ left: `${(state.time / 60) * 100}%` }}
            onMouseEnter={() => handleHover(state.time)}
            onMouseLeave={handleMouseLeave}
          >
            {hoverTime === state.time && (
              <div className="absolute left-1/2 top-[20px] z-10 -translate-x-1/2 transform whitespace-nowrap rounded-[10px] bg-white bg-opacity-80 px-2 py-1 text-[12px] font-semibold text-[#28282C]">
                {droneState} at {hoverTime}s
              </div>
            )}
          </div>
        ))}

        <div className="progress-icon transition-left absolute left-0 top-[-12px] duration-200 ease-linear">
          <img src="/public/images/Vector.svg" />
        </div>

        {children}

        <div className="current-time absolute bottom-[30px] left-5 h-[33px] w-[100px] -translate-x-1/2 transform rounded-[10px] bg-white bg-opacity-50 text-center text-[14px] leading-[33px] text-[#28282C]">
          00:01:30
        </div>

        <div className="time-left absolute bottom-[-30px] left-0 -translate-x-1/2 transform text-[14px] text-black">
          00:00:00
        </div>

        <div className="time-right absolute bottom-[-30px] right-0 translate-x-1/2 transform text-[14px] text-black">
          05:00:00
        </div>
      </div>
    </div>
  );
};

interface ProgressBarBtnProps{
  isPlaying: boolean;
  onClickPlay: () => void;
  onClickPause: () => void;
}
const ProgressBarBtn = ({isPlaying, onClickPlay, onClickPause}:ProgressBarBtnProps) => {
  return (
    <div className="play-icon absolute left-1/2 mt-4 -translate-x-1/2 transform">
      {!isPlaying?(
      <button onClick={onClickPlay} className="h-10 w-10">
        <img src="/images/play.svg" alt="play"/>
      </button>
      ):(
        <button onClick={onClickPause} className="h-10 w-10">
          <img src="/images/pause.svg" alt="pause" />
        </button>
      )}
    </div>
  );
}

export const Bar = Object.assign({
  Progress,
  ProgressBarBtn,
})