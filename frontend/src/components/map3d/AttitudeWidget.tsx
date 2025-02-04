import { Suspense, useContext } from "react";
import Drone from "../home/Drone";
import { PhaseContext } from "@/contexts/PhaseContext";

interface AttitudeWidgetProp {
  headingSpeedData:
    | {
        payload: {
          heading: number;
        };
      }[]
      | null;
  batteryRemainingData:
    | {
        payload: {
          batteryRemaining: number;
        };
      }[]
      | null;
  attitudeData:
    | {
        payload: {
          roll: number;
          pitch: number;
          yaw: number;
        };
      }[]
      | null;
}

// 라디안 -> 도 변환 함수
const radToDeg = (radian: number) => radian * (180 / Math.PI);

const AttitudeWidget = ({
  headingSpeedData,
  batteryRemainingData,
  attitudeData
}: AttitudeWidgetProp) => {
  const { phase } = useContext(PhaseContext);

  const currentHeading = headingSpeedData
    ? (headingSpeedData[Math.floor(phase * (headingSpeedData.length - 1))]?.payload
        .heading ?? 0)
    : 0;

  const currentBattery = batteryRemainingData
    ? (batteryRemainingData[
        Math.floor(phase * (batteryRemainingData.length - 1))
      ]?.payload.batteryRemaining ?? 0)
    : 0;

  const currentRoll = attitudeData
    ? (attitudeData[Math.floor(phase * (attitudeData.length - 1))]?.payload.roll ?? 0)
    : 0;

  const currentPitch = attitudeData
    ? (attitudeData[Math.floor(phase * (attitudeData.length - 1))]?.payload.pitch ??
      0)
    : 0;

  const currentYaw = attitudeData
    ? (attitudeData[Math.floor(phase * (attitudeData.length - 1))]?.payload.yaw ?? 0)
    : 0;

  // 라디안에서 도로 변환
  const currentRollInDegrees = radToDeg(currentRoll);
  const currentPitchInDegrees = radToDeg(currentPitch);
  const currentYawInDegrees = radToDeg(currentYaw);

  return (
    <div className="toolbar-attitude mx-6 my-0 hidden h-[27vh] w-[20vw] grid-cols-[1fr_1fr] grid-rows-[33%_1fr] rounded-[10px] bg-white bg-opacity-90 md:block">
      {/* 배터리 및 헤딩을 가로로 정렬 */}
      <div className="col-start-1 row-start-1 flex w-full items-start justify-between p-2">
        {/* 배터리 */}
        <div className="battery flex items-center">
          <img
            src="/images/battery-charging-01.svg"
            alt="Battery"
            className="mr-2"
          />
          <div className="battery-percentage text-[16px]">
            : {currentBattery}%
          </div>
        </div>

        {/* 헤딩 */}
        <div className="flex items-start">
          <div className="angle mr-2 inline-block w-[35px] rounded-[30px] border-2 border-black text-center text-[12px]">
            {currentHeading}°
          </div>
          <br />
          <div>
            <img src="/images/Frame 69.svg" alt="Heading" />
          </div>
        </div>
      </div>
      {/* 데이터 전달 값 확인용
      <div>
        <p>Yaw 값: {currentYawInDegrees}°</p>
        <p>롤 값: {currentRollInDegrees}°</p>
        <p>피치 값: {currentPitchInDegrees}°</p>
      </div>
*/}
      {/* 드론 3D 모델 */}
      <div className="attitude-3d relative col-span-2 row-start-2 flex items-center justify-center p-2">
        <div className="flex h-[10vh] w-[20vw] items-center justify-center">
          <Suspense fallback={<div>Loading drone...</div>}>
            <Drone
              scale={100}
              rotation={[
                currentRollInDegrees,
                currentYawInDegrees,
                currentPitchInDegrees,
              ]} // 도 단위로 변환된 값 사용
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
