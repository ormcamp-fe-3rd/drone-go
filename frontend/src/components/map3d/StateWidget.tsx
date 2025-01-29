import { useState } from "react";

// TODO: api 데이터로 수정
interface StateProps{
  icon: string;
  title: string;
  values: {"state": string, "time": string}[];
}
const StateAWidget = ({icon, title, values}:StateProps) => {
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

export default StateAWidget;