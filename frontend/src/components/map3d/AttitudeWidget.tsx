import { Suspense, useContext } from "react";
import Drone from "../home/Drone";
import { PhaseContext } from "@/contexts/PhaseContext";

interface AttitudeWidgetProp {
  headingData:
    | {
        payload: {
          heading: number;
        };
      }[]
    | null;
}

const AttitudeWidget = ({ headingData }: AttitudeWidgetProp) => {
  const { phase } = useContext(PhaseContext);

  const currentHeading = headingData
    ? (headingData[Math.floor(phase * (headingData.length - 1))]?.payload
        .heading ?? 0)
    : 0;

  return (
    <div className="toolbar-attitude mx-6 my-0 hidden h-[27vh] w-[20vw] grid-cols-[1fr_1fr] grid-rows-[33%_1fr] rounded-[10px] bg-white bg-opacity-60 md:block">
      {/* 배터리 및 헤딩을 가로로 정렬 */}
      <div className="col-start-1 row-start-1 flex w-full items-start justify-between p-2">
        {/* 배터리 */}
        <div className="battery flex items-center">
          <img
            src="/images/battery-charging-01.svg"
            alt="Battery"
            className="mr-2"
          />
          <div className="battery-percentage text-[16px]">: 100%</div>
        </div>

        {/* 헤딩 */}
        <div className="flex items-start">
          <div className="angle mr-2 inline-block w-[35px] rounded-[30px] border-2 border-black text-center text-[12px]">
            {currentHeading}°
          </div>
          <div>
            <img src="/images/Frame 69.svg" alt="Heading" />
          </div>
        </div>
      </div>

      {/* 드론 3D 모델 */}
      <div className="attitude-3d relative col-span-2 row-start-2 flex items-center justify-center p-2">
        <div className="flex h-[10vh] w-[20vw] items-center justify-center">
          <Suspense fallback={<div>Loading drone...</div>}>
            <Drone
              scale={100}
              rotation={[0, currentHeading, 0]} // 최신 헤딩 반영
              yAnimationHeight={0}
              height={"30vh"}
              width={"20vw"}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AttitudeWidget;
