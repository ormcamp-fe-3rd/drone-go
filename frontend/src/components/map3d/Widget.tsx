import { ReactNode, useContext, useState } from 'react';

import { PhaseContext } from '@/contexts/PhaseContext';
import { FormattedTelemetryPositionData } from '@/types/telemetryPositionDataTypes';

import MiniMap from './MiniMap';

// TODO: 날씨 연동
interface WeatherProps{
  icon: string;
  title: string;
  values: string[];
}
const WeatherWidget = ({ icon, title, values }: WeatherProps) => {
  return (
    <div className="relative mx-6 mt-2 sm:grid hidden h-[5vh] w-[30vw] max-w-[17rem] grid-cols-[0.5fr_0.5fr_1.5fr] md:grid-cols-[1fr_0.5fr_1fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold">
      <div className="flex justify-start items-center border-r-2 border-none md:border-solid border-[#B2B2B7]">
        <img src={icon} alt={title} className="w-6 h-6 mr-2" />
        <p className="pl-2 h-6 hidden md:flex">{title}</p>
      </div>
      <div className="h-6 border-r-2 border-solid border-[#B2B2B7]">
        {values[0]}
      </div>
      <div className='h-6'>{values[1]}</div>
    </div>
  );
};

//TODO: api 데이터로 수정
interface SpeedAltitudeProps{
  icon: string;
  title: string;
  value: string;
}
const SpeedWidget = ({ icon, title, value }: SpeedAltitudeProps) => {
  return (
    <div className="w-[30vw] max-w-[17rem] relative mx-6 mt-2 hidden h-[5vh] grid-cols-2 md:grid-cols-[1fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid">
      <div className="flex items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={icon} alt={title} />
        <p className="pl-2">{title}</p>
      </div>
      <div className="text-right">{value}</div>
    </div>
  );
};

interface AltitudeWidgetProp{
  positionData: FormattedTelemetryPositionData[] | null;
}
const AltitudeWidget = ({positionData}:AltitudeWidgetProp) => {
  const { phase } = useContext(PhaseContext);
  const src = "/images/navigator-01.svg";

  const altitude = positionData
    ? positionData[Math.floor(phase * (positionData.length - 1))].payload.alt
    : 0; // phase 값에 따라 positionData의 고도 선택
    
  return (
    <div className="max-w-[17rem] grid-cols-2 md:grid-cols-[1fr_1.5fr] relative mx-6 mt-2 hidden h-[5vh] w-[30vw] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid">
      <div className="flex items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={src} alt="Altitude" />
        <p className="pl-2">Altitude</p>
      </div>
      <div className="text-right">{altitude}m</div>
    </div>
  );
};

// TODO: api 데이터로 수정
interface StateProps{
  icon: string;
  title: string;
  values: {"state": string, "time": string}[];
}
const StateAlertWidget = ({icon, title, values}:StateProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
      setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`relative mx-6 mt-2 hidden h-[5vh] w-[30vw] max-w-[17rem] grid-cols-[1fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold hover:bg-opacity-80 sm:grid ${isExpanded ? "rounded-b-none" : ""}`}
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

// TODO: 자세데이터 반영한 드론3d 오브젝트로 수정, api 데이터로 수정
interface AttitudeProps{
  children: ReactNode;
}
const AttitudeWidget = ({children}: AttitudeProps) => {
  return (
    <div className="toolbar-attitude mx-6 my-0 hidden h-[27vh] w-[30vw] max-w-[17rem] grid-cols-[1fr_1fr] grid-rows-[33%_1fr] rounded-[10px] bg-white bg-opacity-60 sm:grid">
      {children}

      <div className="attitude-3d col-span-2 row-start-2 flex items-center justify-center p-2">
        <img className="drone w-[70%]" src="/public/images/image 3.png" />
      </div>
    </div>
  );
};


// TODO: api 데이터로 수정
const BatteryState = () => {
  return (
    <div className="toolbar-header1 col-start-1 row-start-1 flex items-start justify-start p-2">
      <div className="battery">
        <img src="/public/images/battery-charging-01.svg" />
      </div>
      <div className="battery-percentage text-[16px]">: 90%</div>
    </div>
  );
}

// TODO: api 데이터로 수정
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
}

interface MiniMapWidgetProp{
  positionData: FormattedTelemetryPositionData[]|null;
}
const MiniMapWidget = ({positionData}:MiniMapWidgetProp) => {
  return (
    <div className="mx-6 my-0 hidden h-[27vh] w-[30vw] max-w-[17rem] rounded-[10px] bg-white bg-opacity-60 sm:grid">
      <MiniMap positionData={positionData} />
    </div>
  );
}


export {
  AltitudeWidget,
  AttitudeWidget,
  BatteryState,
  HeadingState,
  MiniMapWidget,
  SpeedWidget,
  StateAlertWidget,
  WeatherWidget,
};