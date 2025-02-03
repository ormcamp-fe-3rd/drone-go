import { Suspense } from "react";
import Drone from "../home/Drone";

interface AttitudeWidgetProp {
  heading: number;
}

const AttitudeWidget = ({ heading }: AttitudeWidgetProp) => {
  return (
    <div className="toolbar-attitude mx-6 my-0 grid h-[27vh] w-[20vw] grid-cols-[1fr_1fr] grid-rows-[33%_1fr] rounded-[10px] bg-white bg-opacity-60">
      {/* 배터리 */}
      <div className="col-start-1 row-start-1 flex items-start justify-start p-2">
        <div className="battery">
          <img src="/images/battery-charging-01.svg" />
        </div>
        <div className="battery-percentage text-[16px]">: 100%</div>
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
      {/* 드론*/}

      {/* TODO: 자세데이터 반영한 드론3d 오브젝트로 수정 */}
      <div className="attitude-3d relative col-span-2 row-start-2 flex items-center justify-center p-2">
        <div className="flex h-[10vh] w-[20vw] items-center justify-center">
          <Suspense fallback={<div>Loading drone...</div>}>
            <Drone
              scale={100}
              rotation={[0, heading, 0]}
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

export default AttitudeWidget;
