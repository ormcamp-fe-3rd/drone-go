import { ReactNode, Suspense, useState } from "react";
import Drone from "../home/Drone";

interface WeatherProps {
  icon: string;
  title: string;
  values: string[];
}
const WeatherWidget = ({ icon, title, values }: WeatherProps) => {
  return (
    <div className="relative mx-6 mt-2 grid h-[5vh] w-[20vw] grid-cols-[1fr_0.5fr_1fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold">
      <div className="flex items-center justify-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={icon} alt={title} className="mr-2 h-6 w-6" />
        <p className="h-6 pl-2">{title}</p>
      </div>
      <div className="h-6 border-r-2 border-solid border-[#B2B2B7]">
        {values[0]}
      </div>
      <div className="h-6">{values[1]}</div>
    </div>
  );
};

interface SpeedAltitudeProps {
  icon: string;
  title: string;
  value: string;
}
const SpeedAltitudeWidget = ({ icon, title, value }: SpeedAltitudeProps) => {
  return (
    <div className="relative mx-6 mt-2 grid h-[5vh] w-[20vw] grid-cols-[1fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold">
      <div className="flex items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={icon} alt={title} />
        <p className="pl-2">{title}</p>
      </div>
      <div className="text-right">{value}</div>
    </div>
  );
};

interface StateProps {
  icon: string;
  title: string;
  values: { state: string; time: string }[];
}
const StateAlertWidget = ({ icon, title, values }: StateProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`relative mx-6 mt-2 grid h-[5vh] w-[20vw] grid-cols-[1fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold hover:bg-opacity-80 ${isExpanded ? "rounded-b-none" : ""}`}
    >
      <div className="flex items-center">
        <img src={icon} alt={title} />
        <p className="pl-2">{title}</p>
      </div>
      <div>
        <button
          onClick={handleToggle}
          className="flex w-full items-center justify-end"
        >
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
      {isExpanded && (
        <div className="absolute left-0 top-full z-10 mt-0 w-full overflow-y-hidden rounded-b-[10px] bg-white bg-opacity-60 px-2">
          {values.map((item, index) => (
            <div key={index}>
              <div className="flex flex-col gap-1 py-1 text-[#3F5D7E]">
                <div>{item.state}</div>
                <div className="ml-auto text-[10px]">{item.time}</div>
              </div>
              {index !== values.length - 1 && (
                <div className="mt-1 border-b-2 border-solid border-[#B2B2B7]"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface AttitudeProps {
  children: ReactNode;
}

const AttitudeWidget = ({ children }: AttitudeProps) => {
  return (
    <div className="toolbar-attitude mx-6 my-0 grid h-[27vh] w-[20vw] grid-cols-[1fr_1fr] grid-rows-[33%_1fr] rounded-[10px] bg-white bg-opacity-60">
      {children}

      {/* TODO: 자세데이터 반영한 드론3d 오브젝트로 수정 */}
      <div className="attitude-3d relative col-span-2 row-start-2 flex items-center justify-center p-2">
        {/*<img className="drone w-[70%]" src="/public/images/image 3.png" />*/}
        <div className="absolute right-0 top-0 bg-black">
          <Suspense fallback={<div>Loading drone...</div>}>
            <Drone
              scale={100}
              rotation={[0, -50, 0]}
              yAnimationHeight={0}
              height={"20vh"}
              width={"20vw"}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// TODO: 배터리 데이터로 수정
const BatteryState = () => {
  return (
    <div className="toolbar-header1 col-start-1 row-start-1 flex items-start justify-start p-2">
      <div className="battery">
        <img src="/public/images/battery-charging-01.svg" />
      </div>
      <div className="battery-percentage text-[16px]">: 90%</div>
    </div>
  );
};

// TODO: heading 데이터로 수정
const HeadingState = () => {
  return (
    <div className="toolbar-header2 col-start-2 row-start-1 flex items-start justify-end p-2">
      <div className="angle inline-block w-[35px] rounded-[30px] border-2 border-black text-center text-[12px]">
        90°
      </div>
      <div>
        <img src="/public/images/Frame 69.svg" />
      </div>
    </div>
  );
};

export {
  AttitudeWidget,
  BatteryState,
  HeadingState,
  SpeedAltitudeWidget,
  StateAlertWidget,
  WeatherWidget,
};
