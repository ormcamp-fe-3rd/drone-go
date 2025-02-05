import { Suspense, useContext } from "react";

import { PhaseContext } from "@/contexts/PhaseContext";

import Drone from "../home/Drone";

interface AttitudeWidgetProp {
  headingData:
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
  headingData,
  batteryRemainingData,
  attitudeData,
}: AttitudeWidgetProp) => {
  const { phase } = useContext(PhaseContext);

  const currentHeading = headingData
    ? (headingData[Math.floor(phase * (headingData.length - 1))]?.payload
        .heading ?? 0)
    : 0;

  const currentBattery = batteryRemainingData
    ? (batteryRemainingData[
        Math.floor(phase * (batteryRemainingData.length - 1))
      ]?.payload.batteryRemaining ?? 0)
    : 0;

  const currentRoll = attitudeData
    ? (attitudeData[Math.floor(phase * (attitudeData.length - 1))]?.payload
        .roll ?? 0)
    : 0;

  const currentPitch = attitudeData
    ? (attitudeData[Math.floor(phase * (attitudeData.length - 1))]?.payload
        .pitch ?? 0)
    : 0;

  const currentYaw = attitudeData
    ? (attitudeData[Math.floor(phase * (attitudeData.length - 1))]?.payload
        .yaw ?? 0)
    : 0;

  const currentRollInDegrees = radToDeg(currentRoll);
  const currentPitchInDegrees = radToDeg(currentPitch);
  const currentYawInDegrees = radToDeg(currentYaw);

  return (
    <div className="toolbar-attitude mx-6 my-0 hidden h-[27vh] w-[30vw] max-w-[17rem] rounded-[10px] bg-white bg-opacity-80 sm:flex sm:flex-col md:block drop-shadow-md">
      <div className="flex h-5 w-full items-start justify-between p-2">
        <div className="battery flex items-center">
          <img
            src="/images/map/battery-charging-01.svg"
            alt="Battery"
            className="mr-2"
          />
          <div className="battery-percentage text-[16px]">
            : {currentBattery}%
          </div>
        </div>

        <div className="flex items-start">
          <div className="angle mr-2 inline-block w-[35px] rounded-[30px] border-[1px] border-black text-center text-[12px]">
            {currentHeading}°
          </div>
          <br />
        </div>
      </div>

      {/* 드론 3D 모델 */}
      <div className="attitude-3d relative flex h-full w-full items-center justify-center p-2">
        <div className="flex h-full w-full items-center justify-center">
          <Suspense fallback={<div>Loading drone...</div>}>
            <Drone
              scale={100}
              rotation={[
                currentRollInDegrees,
                currentYawInDegrees,
                currentPitchInDegrees,
              ]}
              yAnimationHeight={0}
              height={"100%"}
              width={"100%"}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AttitudeWidget;
