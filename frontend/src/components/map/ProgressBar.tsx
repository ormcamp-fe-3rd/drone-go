import { useState } from "react";

interface DroneState {
  time: number;
  state: string;
}

const ProgressBar = () => {

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
        <div className="video-container w-[80%] max-w-[800px] flex mx-auto mt-[400px]">
            <div className="progress-bar relative w-full h-[8px] mb-[50px] bg-[#504D4D] rounded-[5px]">
              <div className="progress absolute w-0 h-full bg-[#D7D7D7] transition-width duration-200 ease-linear">
              </div>

              {droneStates.map((state, index) => (
                <div
                  key={index}
                  className="drone-dot absolute w-[5px] h-[5px] top-1/2 transform -translate-y-1/2 bg-white rounded-full cursor-pointer"
                  style={{ left: `${(state.time / 60) * 100}%` }}
                  onMouseEnter={() => handleHover(state.time)}
                  onMouseLeave={handleMouseLeave}
                >

                  {hoverTime === state.time && (
                    <div className="absolute top-[20px] left-1/2 transform -translate-x-1/2 text-[#28282C] text-[12px] font-semibold bg-white bg-opacity-80 rounded-[10px] px-2 py-1 whitespace-nowrap z-10">
                      {droneState} at {hoverTime}s
                    </div>
                  )}
                </div>
              ))}

              <div className="progress-icon absolute top-[-12px] left-0 transition-left duration-200 ease-linear">
                <img src="/public/images/Vector.svg" />
              </div>

              <div className="play-icon absolute mt-4 left-1/2 transform -translate-x-1/2">
                <img src="/public/images/play.svg" />
              </div>

              <div className="current-time w-[100px] h-[33px] absolute bottom-[30px] left-5 transform -translate-x-1/2 bg-white bg-opacity-50 rounded-[10px] text-center leading-[33px] text-[#28282C] text-[14px]">
                00:01:30
              </div>

              <div className="time-left absolute left-0 bottom-[-30px] transform -translate-x-1/2 text-white text-[14px]">
                00:00:00
              </div>

              <div className="time-right absolute right-0 bottom-[-30px] transform translate-x-1/2 text-white text-[14px]">
                05:00:00
              </div>

            </div>
        </div>
    );
};

export default ProgressBar;