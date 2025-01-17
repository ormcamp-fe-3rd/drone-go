import React, { useState } from 'react';
import { WidgetData } from '../../types/widgetDataTypes';

const ToolbarWidget: React.FC<WidgetData> = ({ icon, title, dataValues = [], stateValues = [] }) => {

  // 'Weather' 위젯 설정
  const isWeatherWidget = title === "Sunny";

  // 'State' 위젯 설정정
  const isStateWidget = title === "State";
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    if (isStateWidget) {
      setIsExpanded(prev => !prev);
    }
  };
  
  return (
    <div
    className={`w-[274px] h-[52px] relative grid items-center mx-6 p-2.5 bg-white bg-opacity-50 rounded-[10px] text-center text-sm font-bold cursor-pointer
      ${isWeatherWidget ? 'grid-cols-[1fr_0.5fr_1fr]' : 'grid-cols-[1fr_1.5fr]'}
      ${isStateWidget ? 'rounded-b-none' : ''}`}>

      {/* 아이콘 및 항목 제목 */}
      <div className={`flex border-r-2 border-solid border-[#B2B2B7]
        ${isStateWidget ? 'border-none' : ''}`}>
        <img src={icon} alt={title} className="w-6 h-6 mr-2" />
        {title}
      </div>

      {/* 두 번째 칸: 첫 번째 데이터 값 */}
      <div className={`h-6
        ${isWeatherWidget ? 'border-r-2 border-solid border-[#B2B2B7] justify-center' : 'justify-self-end'}`}>
        
        {isStateWidget ? (
          <button
          onClick={handleToggle}
          className="w-full flex justify-center items-center">
          <img 
            src={isExpanded ? "/public/images/togglebtn.svg" : "/public/images/Vector 17.svg"} 
            alt={isExpanded ? "접기" : "펼치기"} 
            className="w-4 h-4" />
          </button>
        ) : (
          dataValues[0]
        )}
      </div>

      {/* 세 번째 칸: 두 번째 데이터 값 (Weather만 해당) */}
      {isWeatherWidget && (
        <div className="h-6 justify-self-center">
          {dataValues[1]}
        </div>
      )}

      {/* State 위젯 추가 상세 정보 표시 */}
      {isStateWidget && isExpanded && (
        <div className="absolute top-full left-0 w-full bg-white bg-opacity-50 rounded-b-[10px] p-2 mt-0 z-10">
          {stateValues.map((item, index) => (
            <div key={index}>
              <div className="flex flex-col py-2 gap-2 text-[#3F5D7E]">
                <div>{item.state}</div>
                <div className="ml-auto text-[10px]">{item.time}</div>
              </div>
              {index !== stateValues.length - 1 && <div className="border-b-2 border-solid border-[#B2B2B7] mt-2"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolbarWidget;
