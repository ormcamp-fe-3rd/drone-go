import * as Cesium from "cesium";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { PhaseContext } from "@/contexts/PhaseContext";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import { formatTime } from "@/utils/formatTime";

import PlayHead from "../map/PlayHead";
import ProgressBar from "../map/ProgressBar";
import ProgressBarBtn from "../map/ProgressBarBtn";

interface CesiumViewerProps {
  positionData: FormattedTelemetryPositionData[] | null;
  stateData:{
    timestamp: Date;
    payload: 
    {text: string;}
  }[] | null;
}

const CesiumViewer: React.FC<CesiumViewerProps> = ({
  positionData,
  stateData,
}) => {
  const cesiumContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const modelEntityRef = useRef<Cesium.Entity | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 애니메이션 관련 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);

  // 시간 관련 상태
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [startEndTime, setStartEndTime] = useState<{
    startTime: string;
    endTime: string;
  }>({ startTime: "", endTime: "" });
  const [flightStartTime, setFlightStartTime] = useState(0);

  const { phase, setPhase } = useContext(PhaseContext);

  // Cesium viewer 초기화
  useEffect(() => {
    if (!cesiumContainerRef.current || isInitialized) return;

    const initViewer = async () => {
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

        const buildingTileset = await Cesium.Cesium3DTileset.fromIonAssetId(
          96188,
          {
            maximumScreenSpaceError: 16,
          },
        );

        viewerRef.current.scene.primitives.add(buildingTileset);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Cesium:", error);
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      setIsInitialized(false);
    };
  }, []);

  useEffect(() => {
    if (positionData) {
      setPhase(0);
    }
  }, [positionData, setPhase]);

  // phase에 따른 드론 위치 업데이트
  const updateDronePosition = useCallback(
    (currentPhase: number) => {
      if (!viewerRef.current || !positionData || !modelEntityRef.current)
        return;

      const index = Math.min(
        Math.floor(currentPhase * (positionData.length - 1)),
        positionData.length - 1,
      );

      if (!positionData[index] || !positionData[index].payload) return;

      const currentItem = positionData[index];
      const position = Cesium.Cartesian3.fromDegrees(
        currentItem.payload.lon,
        currentItem.payload.lat,
        currentItem.payload.alt,
      );

      // 위치 업데이트
      modelEntityRef.current.position = new Cesium.ConstantPositionProperty(
        position,
      );

      // 방향 계산 및 업데이트
      if (index > 0) {
        const prevItem = positionData[index - 1];
        const prevPosition = Cesium.Cartesian3.fromDegrees(
          prevItem.payload.lon,
          prevItem.payload.lat,
          prevItem.payload.alt,
        );

        const direction = Cesium.Cartesian3.subtract(
          position,
          prevPosition,
          new Cesium.Cartesian3(),
        );

        if (Cesium.Cartesian3.magnitudeSquared(direction) > 0) {
          Cesium.Cartesian3.normalize(direction, direction);
          const heading = Math.atan2(direction.y, direction.x);
          const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(heading, 0, 0),
          );
          modelEntityRef.current.orientation = new Cesium.ConstantProperty(
            orientation,
          );
        }
      }

      // 카메라 업데이트
      if (!viewerRef.current.trackedEntity) {
        viewerRef.current.trackedEntity = modelEntityRef.current;
      }
    },
    [positionData],
  );

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

    // 시간 정보 설정
    const flightStart = positionData[0].timestamp;
    const flightEnd = positionData[positionData.length - 1].timestamp;
    setFlightStartTime(flightStart);
    setStartEndTime({
      startTime: formatTime(new Date(flightStart)),
      endTime: formatTime(new Date(flightEnd)),
    });
    setTotalDuration((flightEnd - flightStart) / 1000);

    // 경로 라인 추가
    const pathPositions = positionData.map((item) =>
      Cesium.Cartesian3.fromDegrees(
        item.payload.lon,
        item.payload.lat,
        item.payload.alt,
      ),
    );

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
    updateDronePosition(0);
  }, [positionData, isInitialized, updateDronePosition]);

  // phase 변경 시 드론 위치 업데이트
  useEffect(() => {
    updateDronePosition(phase);
  }, [phase, updateDronePosition]);

  // 애니메이션 프레임 처리
  const animate = useCallback(
    (currentTime: number) => {
      if (!totalDuration) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      elapsedTimeRef.current += deltaTime * speed;
      lastTimeRef.current = currentTime;

      const animationDuration = totalDuration * 1000;
      const newPhase = Math.min(1, elapsedTimeRef.current / animationDuration);
      setPhase(newPhase);

      if (newPhase >= 1) {
        setIsPlaying(false);
        setPhase(0);
        lastTimeRef.current = 0;
        elapsedTimeRef.current = 0;
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [totalDuration, speed, setPhase],
  );

  const handlePlay = () => {
    setIsPlaying(true);
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    }
  };

  const handlePlaySpeed = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(e.target.value));
  };

  return (
    <>
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
      <div className="fixed bottom-0 w-screen">
        <ProgressBar
          startTime={startEndTime.startTime}
          endTime={startEndTime.endTime}
          stateData={stateData}          
        >
          <PlayHead
            duration={totalDuration}
            flightStartTime={flightStartTime}
          />
          <ProgressBarBtn
            isPlaying={isPlaying}
            onClickPlay={handlePlay}
            onClickPause={handlePause}
          />
        </ProgressBar>
        <select className="w-24" onChange={handlePlaySpeed}>
          <option value="1">1x speed</option>
          <option value="2">2x speed</option>
          <option value="5">5x speed</option>
          <option value="10">10x speed</option>
        </select>
      </div>
    </>
  );
};

export default CesiumViewer;
