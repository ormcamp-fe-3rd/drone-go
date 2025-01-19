const ToolbarAttitude = () => {
    return (
        <div className="toolbar-attitude w-[274px] h-[300px] grid grid-rows-[33%_1fr] grid-cols-[1fr_1fr] mx-6 bg-white bg-opacity-60 rounded-[10px] ">
          <div className="toolbar-header1 row-start-1 col-start-1 flex justify-start items-start p-2.5">
            <div className="battery">
              <img src="/public/images/battery-charging-01.svg" />
            </div>
            <div className="battery-percentage text-[16px]">: 90%</div>
          </div>
          <div className="toolbar-header2 row-start-1 col-start-2 flex justify-end items-start p-2.5">
            <div className="angle w-[35px] inline-block border-2 border-black rounded-[30px] text-center text-[12px]">90°</div>
            <div>
              <img src="/public/images/Frame 69.svg" />
            </div>
          </div>
          <div className="attitude-3d row-start-2 col-span-2 flex justify-center items-center p-2.5">
            <img className="drone w-[253px]" src="/public/images/image 3.png" />
          </div>
        </div>
    );
};

export default ToolbarAttitude;