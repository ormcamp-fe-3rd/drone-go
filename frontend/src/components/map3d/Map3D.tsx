import { Canvas } from "@react-three/fiber";
import { intervalToDuration } from "date-fns";
import mapboxgl from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { AltitudeContext } from "@/contexts/AltitudeContext";
import { PhaseContext } from "@/contexts/PhaseContext";
import latLonDataTarget from "@/data/latLonDataCamera.json";
import { LatLonAlt } from "@/types/latLonAlt";
import { TelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import {
  calculateDistance,
  calculatePointAlongRoute,
} from "@/utils/calculateDistance";
import { formatTime } from "@/utils/formatTime";

import { Bar } from "../map/ProgressBar";
import DroneInMap from "./DroneInMap";

interface Props {
  positionData: TelemetryPositionData[]|null;
}

export default function Map3D({ positionData }: Props) {
  const mapRef = useRef<MapRef>(null); //맵 인스턴스 접근
  const { setAltitude } = useContext(AltitudeContext);
  const [latLonAlt, setLatLonAlt] = useState<LatLonAlt[] | null>(latLonDataTarget);
  const [totalFlightSeconds, setTotalFlighSeconds] = useState<number>(0);
  const [startEndTime, setStartEndTime] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const {phase, setPhase} = useContext(PhaseContext);

  // 애니메이션 관련 변수
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0); // 총 경과 시간 저장
  const lastTimeRef = useRef<number>(0); // 마지막 프레임 시간 저장
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!mapRef.current || !positionData) return;

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


    const flightStartTime = positionData[0].timestamp;
    const flightEndTime = positionData[positionData.length - 1].timestamp;
    const formattedStartTime = formatTime(flightStartTime); // Date 타입 -> HH:mm:ss(string 타입)으로 포맷
    const formattedEndTime = formatTime(flightEndTime);
    setStartEndTime({
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });

    // 총 비행 시간 계산 (intervalToDuration 사용)
    const {
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = intervalToDuration({
      start: flightStartTime,
      end: flightEndTime,
    });

    setTotalFlighSeconds((hours*3600 + minutes*60 + seconds)*100);
  }, [positionData]);

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
    const map = mapRef.current.getMap();

    // 첫 프레임이거나 재생 시작 시
    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
    }

    // 이전 프레임과의 시간 차이를 계산하여 경과 시간에 추가
    const deltaTime = currentTime - lastTimeRef.current;
    elapsedTimeRef.current += deltaTime;
    lastTimeRef.current = currentTime;

    const animationDuration = totalFlightSeconds / speed; // 단위: 밀리초

    // 총 이동거리
    const routeDistance = calculateDistance(latLonAlt);
    const cameraRouteDistance = routeDistance;

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

    // 현재 이동거리에 따른 이동지점
    const alongPoint = calculatePointAlongRoute(
      latLonAlt,
      routeDistance * phase || 0.001,
    );
    const alongCamera = calculatePointAlongRoute(
      latLonAlt,
      cameraRouteDistance * phase || 0.001,
    );

    const cameraAltitude = alongPoint.alt;
    const alongRoute = [alongPoint.lon, alongPoint.lat];
    const alongRouteCamera = [alongCamera.lon, alongCamera.lat];

    const camera = map.getFreeCameraOptions();

    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
      {
        lng: alongRouteCamera[0],
        lat: alongRouteCamera[1],
      },
      cameraAltitude,
    );

    camera.lookAtPoint({
      lng: alongRoute[0],
      lat: alongRoute[1],
    });

    map.setFreeCameraOptions(camera);

    setAltitude(Number(alongPoint.alt.toFixed(2)));
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
        <Bar.Progress
          startTime={startEndTime?.startTime}
          endTime={startEndTime?.endTime}
        >
          <Bar.PlayHead />
          <Bar.ProgressBarBtn
            isPlaying={isPlaying}
            onClickPlay={handlePlay}
            onClickPause={handlePause}
          />
        </Bar.Progress>
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
