const AttitudeWidget = () => {
  return (
    <div className="toolbar-attitude mx-6 my-0 hidden h-[27vh] w-[30vw] max-w-[17rem] grid-cols-[1fr_1fr] grid-rows-[33%_1fr] rounded-[10px] bg-white bg-opacity-60 sm:grid">
      {/* 배터리 */}
      <div className="col-start-1 row-start-1 flex items-start justify-start p-2">
        <div className="battery">
          <img src="/images/battery-charging-01.svg" />
        </div>
        <div className="battery-percentage text-[16px]">: 90%</div>
      </div>

      {/* 헤딩 */}
      <div className="col-start-2 row-start-1 flex items-start justify-end p-2">
        <div className="angle inline-block w-[35px] rounded-[30px] border-2 border-black text-center text-[12px]">
          90°
        </div>
        <div>
          <img src="/images/Frame 69.svg" />
        </div>
      </div>

      <div className="col-span-2 row-start-2 flex items-center justify-center p-2">
        <img className="drone w-[70%]" src="/public/images/image 3.png" />
      </div>
    </div>
  );
};

export default AttitudeWidget