import { Canvas } from "@react-three/fiber";
import mapboxgl from "mapbox-gl";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { PhaseContext } from "@/contexts/PhaseContext";
import { LatLonAlt } from "@/types/latLonAlt";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import {
  calculateDistance,
  calculatePointAlongRoute,
} from "@/utils/calculateDistance";
import { formatTime } from "@/utils/formatTime";

import PlayHead from "../map/PlayHead";
import ProgressBar from "../map/ProgressBar";
import ProgressBarBtn from "../map/ProgressBarBtn";
import DroneInMap from "./DroneInMap";

interface Props {
  positionData: FormattedTelemetryPositionData[] | null;
}

export default function Map3D({ positionData }: Props) {
  const mapRef = useRef<MapRef>(null); //맵 인스턴스 접근
  const [latLonAlt, setLatLonAlt] = useState<LatLonAlt[] | null>();
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [startEndTime, setStartEndTime] = useState<{
    startTime: string;
    endTime: string;
  }>({startTime: "", endTime: ""});
  const [flightStartTime, setFlightStartTime] = useState(0);
  const { phase, setPhase } = useContext(PhaseContext);

  // 애니메이션 관련 변수
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0); // 총 경과 시간 저장
  const lastTimeRef = useRef<number>(0); // 마지막 프레임 시간 저장
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!mapRef.current || !positionData) return;
    setPhase(0);

    const payloadData: LatLonAlt[] = positionData.map((item) => ({
      lat: item.payload.lat,
      lon: item.payload.lon,
      alt: item.payload.alt,
    }));
    setLatLonAlt(payloadData);

    mapRef.current.setCenter([
      positionData[0].payload.lon,
      positionData[0].payload.lat,
    ]);

    const flightStartTime = positionData[0].timestamp; // Unix 타임스탬프
    const flightEndTime = positionData[positionData.length - 1].timestamp;
    const formattedStartTime = formatTime(new Date(flightStartTime)); // HH:mm:ss(string 타입)으로 포맷
    const formattedEndTime = formatTime(new Date(flightEndTime));
    setStartEndTime({
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
    setFlightStartTime(flightStartTime);
    const totalFlightTime = (flightEndTime - flightStartTime)/1000;

    
    setTotalDuration(totalFlightTime/speed);
  }, [positionData, speed, setPhase]);


  const updateCamera = useCallback(() => {
    if (!totalDuration || !latLonAlt || !mapRef.current) return;
    const map = mapRef.current!.getMap();
    const routeDistance = calculateDistance(latLonAlt);

    // 현재 phase에 따른 위치 계산
    const alongPoint = calculatePointAlongRoute(
      latLonAlt,
      routeDistance * phase || 0.001,
    );

    const cameraAltitude = alongPoint.alt;

    const camera = map.getFreeCameraOptions();
    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
      {
        lng: alongPoint.lon,
        lat: alongPoint.lat,
      },
      cameraAltitude,
    );
    camera.lookAtPoint({
      lng: alongPoint.lon,
      lat: alongPoint.lat,
    });

    map.setFreeCameraOptions(camera);
    // setAltitude(Number(alongPoint.alt.toFixed(2)));
  }, [totalDuration, latLonAlt, mapRef, phase]);
  
  useEffect(() => {
    elapsedTimeRef.current = phase * totalDuration * 1000;
    updateCamera(); // phase 변경 시 카메라 위치 업데이트
  }, [phase, totalDuration, elapsedTimeRef, updateCamera]);

  // TODO: 회전기능은 후순위로 작업
  // const [dragPosition, setDragPosition] = useState<{
  //   x: number;
  //   y: number;
  // } | null>(null);
  // const [isDragging, setIsDragging] = useState(false);

  // const handleMouseDown = (event: mapboxgl.MapMouseEvent) => {
  //   if (event.originalEvent.ctrlKey) {
  //     setIsDragging(true);
  //   }
  // };

  // const handleMouseMove = (event: mapboxgl.MapMouseEvent) => {
  //   if (!isDragging || !mapRef.current) return;

  //   const point = event.point;
  //   const x = (point.x / mapRef.current.getContainer().clientWidth) * 2 - 1;
  //   const y = -(point.y / mapRef.current.getContainer().clientWidth) * 2 + 1;
  //   setDragPosition({ x: x, y: y });
  // };

  // const handleMouseUp = () => {
  //   setIsDragging(false);
  //   setDragPosition(null);
  // };

  const animate = (currentTime: number) => {
    if (!mapRef.current || !latLonAlt || !positionData) return;

    // 첫 프레임이거나 재생 시작 시
    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
    }

    // 이전 프레임과의 시간 차이를 계산하여 경과 시간에 추가
    const deltaTime = currentTime - lastTimeRef.current;
    elapsedTimeRef.current += deltaTime;
    lastTimeRef.current = currentTime;

    const animationDuration = totalDuration * 1000; // 단위: 밀리초

    const phase = Math.min(1, elapsedTimeRef.current / animationDuration);
    setPhase(phase);

    if (phase >= 1) {
      // 애니메이션 완료
      setIsPlaying(false);
      setPhase(0);
      lastTimeRef.current = 0;
      elapsedTimeRef.current = 0;
      return;
    }
    updateCamera();
    animationRef.current = window.requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    lastTimeRef.current = 0; // 새로운 시작 시간을 설정하기 위해 리셋
    animationRef.current = window.requestAnimationFrame(animate);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0; // 일시정지 시 마지막 시간 리셋
    }
  };

  const handlePlaySpeed = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSpeed(Number(e.target.value));
    setIsPlaying(false);
    lastTimeRef.current = 0;
    elapsedTimeRef.current = 0;
  };

  return (
    <>
      <div className="fixed inset-0">
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: 126.976944, //경도
            latitude: 37.572398, //위도
            zoom: 18,
            pitch: 45,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/standard"
          boxZoom={false}
          doubleClickZoom={false}
          dragPan={false}
          keyboard={false}
          scrollZoom={false}
          touchPitch={false}
          touchZoomRotate={false}
          dragRotate={true} //드래그로 회전만 가능
          // TODO: 회전기능은 후순위로 작업
          // onMouseDown={handleMouseDown}
          // onMouseUp={handleMouseUp}
          // onMouseMove={handleMouseMove}
        >
          <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2">
            <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
              <DroneInMap />
            </Canvas>
          </div>
        </Map>
      </div>
      <div className="fixed bottom-0 w-screen">
        <ProgressBar
          startTime={startEndTime.startTime}
          endTime={startEndTime.endTime}
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
}
