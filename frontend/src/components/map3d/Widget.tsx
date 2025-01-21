import { useState } from 'react';
import { WidgetData } from '@/types/widgetDataTypes';
import { Operation, Robot } from "@/types/selectOptionsTypes";
import { TelemetryAttitudeData } from "@/types/telemetryAttitudeDataTypes";
import AttitudeViewer from '../map/AttitudeViewer';

interface Props {
  selectedDrone: Robot | null;
  selectedOperation: Operation | null;
  widgetData: WidgetData[];
  attitudeData: TelemetryAttitudeData[];
}

const WidgetBasic = ({ selectedDrone, selectedOperation, widgetData, attitudeData }: Props) => {
  return (
    <div className="grid mt-0">
      {widgetData.map((widget, index) => {
        // Weather Widget
        if (widget.title === "Sunny" && widget.dataValues?.length === 2) {
          return (
            <WeatherWidget
              key={index}
              icon={widget.icon}
              title={widget.title}
              values={widget.dataValues}
            />
          );
        }

        // Speed and Altitude Widgets
        if (
          (widget.title === "Speed" || widget.title === "Altitude") &&
          widget.dataValues?.length === 1
        ) {
          return (
            <SpeedAltitudeWidget
              key={index}
              icon={widget.icon}
              title={widget.title}
              value={widget.dataValues[0]}
            />
          );
        }

        // State Alarm Widget
        if (widget.title === "State" && widget.stateValues) {
          return (
            <StateAlertWidget
              key={index}
              icon={widget.icon}
              title={widget.title}
              values={widget.stateValues}
            />
          );
        }

        // Attitude Widget
        if (widget.title === "Attitude") {
          return (
            <AttitudeWidget
              key={index}
              robotId={selectedDrone?._id ?? ""}
              operationId={selectedOperation?._id ?? ""}
              attitudeData={attitudeData}
            />
          );
        }

        return null; // Handle unknown widget types
      })}
    </div>
  );
};

export default WidgetBasic;

// Weather Widget
interface WeatherProps {
  icon: string;
  title: string;
  values: string[];
}

const WeatherWidget = ({ icon, title, values }: WeatherProps) => {
  return (
    <div className="relative mx-6 mt-2 grid h-[5vh] w-[20vw] grid-cols-[1fr_0.5fr_1fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold">
      <div className="flex justify-center items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={icon} alt={title} className="w-6 h-6 mr-2" />
        <p className="pl-2 h-6">{title}</p>
      </div>
      <div className="h-6 border-r-2 border-solid border-[#B2B2B7]">
        {values[0]}
      </div>
      <div className='h-6'>{values[1]}</div>
    </div>
  );
};

// Speed and Altitude Widget
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

// State Alert Widget
interface StateProps {
  icon: string;
  title: string;
  values: { "state": string, "time": string }[];
}

const StateAlertWidget = ({ icon, title, values }: StateProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`relative mx-6 mt-2 grid h-[5vh] w-[20vw] grid-cols-[1fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold hover:bg-opacity-80 ${isExpanded ? "rounded-b-none" : ""}`}>
      <div className="flex items-center">
        <img src={icon} alt={title} />
        <p className="pl-2">{title}</p>
      </div>
      <div>
        <button
          onClick={handleToggle}
          className="flex w-full items-center justify-end"
        >
          <img src={isExpanded
            ? "/public/images/togglebtn.svg"
            : "/public/images/Vector 17.svg"}
            alt={isExpanded ? "접기" : "펼치기"}
            className="h-4 w-4"
          />
        </button>
      </div>
      {isExpanded && (
        <div className="absolute top-full left-0 w-full bg-white bg-opacity-60 rounded-b-[10px] px-2 mt-0 z-10 overflow-y-hidden">
          {values.map((item, index) => (
            <div key={index}>
              <div className="flex flex-col py-1 gap-1 text-[#3F5D7E]">
                <div>{item.state}</div>
                <div className="ml-auto text-[10px]">{item.time}</div>
              </div>
              {index !== values.length - 1 && <div className="border-b-2 border-solid border-[#B2B2B7] mt-1"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Attitude Widget
const AttitudeWidget: React.FC<{ robotId: Robot['_id'], operationId: Operation['_id'], attitudeData: TelemetryAttitudeData[] }> = ({ robotId, operationId, attitudeData }) => {
  return (
    <div className="toolbar-attitude mx-6 my-0 grid h-[27vh] w-[20vw] grid-cols-[1fr_1fr] grid-rows-[33%_1fr] rounded-[10px] bg-white bg-opacity-60">
      <div className="toolbar-header1 col-start-1 row-start-1 flex items-start justify-start p-2">
        <div className="battery">
          <img src="/public/images/battery-charging-01.svg" />
        </div>
        <div className="battery-percentage text-[16px]">: 90%</div>
      </div>
      <div className="toolbar-header2 col-start-2 row-start-1 flex items-start justify-end p-2">
        <div className="angle inline-block w-[35px] rounded-[30px] border-2 border-black text-center text-[12px]">
          90°
        </div>
        <div className='w-[80px] h-[80px]'>
          <AttitudeViewer
            robotId={robotId}
            operationId={operationId}
            attitudeData={attitudeData}
          />
        </div>
      </div>
      <div className="attitude-3d col-span-2 row-start-2 flex items-center justify-center p-2">
        <img className="drone w-[70%]" src="/public/images/image 3.png" />
      </div>
    </div>
  );
};

// Export all widgets together
export const Widget = Object.assign({
  WeatherWidget,
  SpeedAltitudeWidget,
  StateAlertWidget,
  AttitudeWidget,
  WidgetBasic,
});



