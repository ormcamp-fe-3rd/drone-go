import * as Cesium from "cesium";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { PhaseContext } from "@/contexts/PhaseContext";
import { useAnimationTime } from "@/hooks/useAnimationTime";
import { usePositionData } from "@/hooks/usePositionData";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import { initCesiumMap } from "@/utils/initCesiumMap";
import { updateDronePosition } from "@/utils/updateDronePosition";

import PlayHead from "../map/PlayHead";
import ProgressBar from "../map/ProgressBar";
import ProgressBarBtns from "../map/ProgressBarBtns";

const INITIAL_INFO_DURATION_MS = 5000;
const DRONE_MODEL_URI = "/objects/drone.glb";
const DRONE_MODEL_MIN_PIXEL_SIZE = 64;
const DRONE_MODEL_SCALE = 10;
const PATH_LINE_WIDTH = 3;

interface CesiumViewerProps {
  positionData: FormattedTelemetryPositionData[] | null;
}

const CesiumViewer3D: React.FC<CesiumViewerProps> = ({ positionData }) => {
  const cesiumContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const modelEntityRef = useRef<Cesium.Entity | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showInitialInfo, setShowInitialInfo] = useState(false);

  const { phase, setPhase } = useContext(PhaseContext);
  const { 
    pathPositions
  } = usePositionData({
    positionData: positionData
  })
  const pathPositionsRef = useRef<Cesium.Cartesian3[]>([]);

  const { 
    isPlaying, speed, elapsedTimeRef,
    handlePlay, handlePause, handleStop, handlePlaySpeed,
    totalDuration, startEndTime, flightStartTime,
  } = useAnimationTime({
    positionData: positionData, 
    onUpdate: (progress) => {
      setPhase(progress);
      updateDronePosition(progress, pathPositions, modelEntityRef, viewerRef);
  }})


  // Cesium viewer 초기화
  useEffect(() => {
    if (!cesiumContainerRef.current || isInitialized) return;

    initCesiumMap(viewerRef, cesiumContainerRef, setIsInitialized);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      setIsInitialized(false);
    };
  }, []);


  useEffect(() => {
    if (pathPositions) {
      pathPositionsRef.current = pathPositions;
    }
  }, [pathPositions]);


  // 경로 데이터 설정
  useEffect(() => {
    if (
      !viewerRef.current ||
      !pathPositionsRef.current ||
      !isInitialized 
    )
      return;

    viewerRef.current.entities.removeAll();

    // 경로 라인 추가
    viewerRef.current.entities.add({
      polyline: {
        positions: pathPositionsRef.current,
        material: Cesium.Color.BLUE,
        width: PATH_LINE_WIDTH,
      },
    });

    // 드론 모델 엔티티 추가
    modelEntityRef.current = viewerRef.current.entities.add({
      model: {
        uri: DRONE_MODEL_URI,
        minimumPixelSize: DRONE_MODEL_MIN_PIXEL_SIZE,
        scale: DRONE_MODEL_SCALE,
      },
    });

    // 초기 위치 설정
    updateDronePosition(0, pathPositionsRef.current, modelEntityRef, viewerRef);
    setPhase(0);

    // 초기 카메라 스크롤 안내문구
    setShowInitialInfo(true);
    const timer = setTimeout(() => {
      setShowInitialInfo(false);
    }, INITIAL_INFO_DURATION_MS);
    return () => clearTimeout(timer);

  }, [isInitialized, pathPositions, positionData, setPhase]);


  // phase 변경 시 드론 위치 업데이트
  useEffect(() => {
    elapsedTimeRef.current = phase * totalDuration * 1000;
    updateDronePosition(phase, pathPositions, modelEntityRef, viewerRef);
  }, [elapsedTimeRef, pathPositions, phase, totalDuration]);



  return (
    <>
      <div className="fixed inset-0 h-screen w-screen">
        <div
          ref={cesiumContainerRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {showInitialInfo && (
          <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <div className="pointer-events-none flex h-20 w-56 items-center rounded-2xl bg-white bg-opacity-90 drop-shadow-md">
              <p className="w-full text-center">
                Scroll to zoom out <br /> for a better view!
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-10 w-screen">
        <ProgressBar
          startTime={startEndTime.startTime}
          endTime={startEndTime.endTime}
        >
          <PlayHead
            duration={totalDuration}
            flightStartTime={flightStartTime}
          />
          <ProgressBarBtns
            isPlaying={isPlaying}
            onClickPlay={handlePlay}
            onClickPause={handlePause}
            onChangeSpeed={handlePlaySpeed}
            onClickStop={handleStop}
            speed={speed}
          />
        </ProgressBar>
      </div>
    </>
  );
};

export default CesiumViewer3D;
