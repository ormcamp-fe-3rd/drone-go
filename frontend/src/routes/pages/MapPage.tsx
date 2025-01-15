import '../../styles/global-map.css';
import DetailedDataHeader from '@/components/charts/DetailedDataHeader';

const MapPage = () => {
  
  return (
    <div>

      <DetailedDataHeader />

      <section className="toolbar grid justify-start m-4 gap-4">
        <div className="toolbar-attitude tool-layout">
          <div className="attitude-header1">
            <div className="battery">
              <img src="/public/images/battery-charging-01.svg" />
            </div>
            <div className="battery-percentage text-[14px]">: 90%</div>
          </div>
          <div className="attitude-header2">
            <div className="angle w-[35px] inline-block border-2 border-black rounded-[30px] text-center text-[12px]">90°</div>
            <div>
              <img src="/public/images/Frame 69.svg" />
            </div>
          </div>
          <div className="attitude-3d row-start-2 col-span-2">
            <img className="drone w-[253px]" src="/public/images/image 3.png" />
          </div>
        </div>

        <div className="toolbar-weather toolbar-variation">weather</div>

        <div className="toolbar-speed toolbar-variation">
          <div className="speed-panel">
            <img src="/public/images/rocket-01.svg" />Speed
          </div>
          <div className="speed-value">40m/s</div>
        </div>

        <div className="toolbar-altitude toolbar-variation">
          <div className="altitude-panel">
            <img src="/public/images/navigator-01.svg" />Altitude
          </div>
          <div className="altitude-value">80m</div>
        </div>

        <div className="toolbar-state tool-layout">
          <div className="state-header1">
            <div className="state-icon">
              <img src="/public/images/setting-error-03.svg" />State
            </div>
          </div>
          <div className="state-header2">
            <div>
              <img src="/public/images/Vector 17.svg" />
            </div>
          </div>
          <div className="state-detail state row-start-2 col-span-2 flex flex-col gap-[2em]">
            <div className="state-panel">
              <p className="state-phrase">Drone is hovering at 10 meters altitude.</p>
              <p className="state-time">00:04:12</p>
            </div>
            <div className="state-panel">
              <p className="state-phrase">Drone is hovering at 10 meters altitude.</p>
              <p className="state-time">00:04:12</p>
            </div>
            <div className="state-panel">
              <p className="state-phrase">Drone is hovering at 10 meters altitude.</p>
              <p className="state-time">00:04:12</p>
            </div>
          </div>
        </div>
      </section>

      <div className="video-container w-[80%] max-w-[800px] flex mx-auto">
        <div className="progress-bar relative w-full h-[8px] mt-[50px] mb-[50px] bg-[#504D4D] rounded-[5px]">
          <div className="progress absolute w-0 h-full bg-[#D7D7D7] transition-width duration-200 ease-linear"></div>
          <div className="progress-icon absolute top-[-12px] left-0 transition-left duration-200 ease-linear">
            <img src="/public/images/Vector.svg" />
          </div>
          <div className="play-icon absolute mt-4 left-1/2 transform -translate-x-1/2">
            <img src="/public/images/play.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;






















