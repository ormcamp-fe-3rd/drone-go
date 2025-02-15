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
import { updateDronePosition } from "@/utils/updateDronePosition";

import PlayHead from "../map/PlayHead";
import ProgressBar from "../map/ProgressBar";
import ProgressBarBtns from "../map/ProgressBarBtns";

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

    initViewer(viewerRef, cesiumContainerRef, setIsInitialized);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      setIsInitialized(false);
    };
  }, []);


  // 경로 데이터 설정
  useEffect(() => {
    if (
      !viewerRef.current ||
      !positionData ||
      !isInitialized ||
      positionData.length === 0
    )
      return;

    viewerRef.current.entities.removeAll();

    // 경로 라인 추가
    viewerRef.current.entities.add({
      polyline: {
        positions: pathPositions,
        material: Cesium.Color.BLUE,
        width: 3,
      },
    });

    // 드론 모델 엔티티 추가
    modelEntityRef.current = viewerRef.current.entities.add({
      model: {
        uri: "/objects/drone.glb",
        minimumPixelSize: 64,
        scale: 10,
      },
    });

    // 초기 위치 설정
    updateDronePosition(0, pathPositions, modelEntityRef, viewerRef);
    setPhase(0);

    // 초기 카메라 스크롤 안내문구
    setShowInitialInfo(true);
    const timer = setTimeout(() => {
      setShowInitialInfo(false);
    }, 5000);
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

const initViewer = async (
  viewerRef: React.MutableRefObject<Cesium.Viewer | null>,
  cesiumContainerRef: React.MutableRefObject<HTMLDivElement | null>,
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_API_KEY;
    const terrainProvider = await Cesium.createWorldTerrainAsync();

    if (viewerRef.current) {
      viewerRef.current.destroy();
    }
    if (!cesiumContainerRef.current) return;
    viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, {
      terrainProvider,
      animation: false,
      timeline: false,
      homeButton: false,
      sceneModePicker: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      geocoder: false,
      infoBox: false,
      navigationInstructionsInitiallyVisible: false,
      baseLayerPicker: false,
      vrButton: false,
      projectionPicker: false,
    });

    const buildingTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188, {
      maximumScreenSpaceError: 16,
    });

    viewerRef.current.scene.primitives.add(buildingTileset);

    setIsInitialized(true);
  } catch (error) {
    console.error("Failed to initialize Cesium:", error);
  }
};
