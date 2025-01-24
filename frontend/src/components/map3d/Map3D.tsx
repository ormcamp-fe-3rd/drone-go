import { Canvas } from "@react-three/fiber";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { LatLonAlt } from "@/types/latLonAlt";
import { calculateDistance, calculatePointAlongRoute } from "@/utils/calculateDistance";

import  { Bar } from "../map/ProgressBar";
import DroneInMap from "./DroneInMap";

interface Props{
  latLonAltData: LatLonAlt[];
}

export default function Map3D({latLonAltData}:Props) {
  const mapRef = useRef<MapRef>(null); //맵 인스턴스 접근
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 애니메이션 관련 변수
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0); // 총 경과 시간 저장
  const lastTimeRef = useRef<number>(0); // 마지막 프레임 시간 저장

  useEffect(() => {
    if (!latLonAltData) return;
    mapRef.current?.setCenter([latLonAltData[0].lon, latLonAltData[0].lat]);
  }, [latLonAltData]);
  
  const handleMouseDown = (event: mapboxgl.MapMouseEvent) => {
    if (event.originalEvent.ctrlKey) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event: mapboxgl.MapMouseEvent) => {
    if (!isDragging || !mapRef.current) return;

    const point = event.point;
    const x = (point.x / mapRef.current.getContainer().clientWidth) * 2 - 1;
    const y = -(point.y / mapRef.current.getContainer().clientWidth) * 2 + 1;
    setDragPosition({ x: x, y: y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragPosition(null);
  };


  const animate = (currentTime: number) => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    // 첫 프레임이거나 재생 시작 시
    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
    }

    // 이전 프레임과의 시간 차이를 계산하여 경과 시간에 추가
    const deltaTime = currentTime - lastTimeRef.current;
    elapsedTimeRef.current += deltaTime;
    lastTimeRef.current = currentTime;

    const animationDuration = 8000;
    const cameraAltitude = 600;

    //TODO: latLonData를 실제 데이터로 변경
    // 총 이동거리
    const routeDistance = calculateDistance(latLonAltData);
    const cameraRouteDistance = calculateDistance(latLonAltData);

    const phase = Math.min(1, elapsedTimeRef.current / animationDuration);

    if (phase >= 1) {
      // 애니메이션 완료
      setIsPlaying(false); 
      lastTimeRef.current = 0;
      elapsedTimeRef.current = 0;
      return;
    }

    // 현재 이동거리에 따른 이동지점
    const alongPoint = calculatePointAlongRoute(
      latLonAltData,
      routeDistance * phase || 0.001,
    );
    const alongCamera = calculatePointAlongRoute(
      latLonAltData,
      cameraRouteDistance * phase || 0.001,
    );

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

    animationRef.current = window.requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    lastTimeRef.current = 0; // 새로운 시작 시간을 설정하기 위해 리셋
    setIsPlaying(true);
    animationRef.current = window.requestAnimationFrame(animate);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0; // 일시정지 시 마지막 시간 리셋
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2">
            <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
              <DroneInMap dragPosition={dragPosition} />
            </Canvas>
          </div>
        </Map>
      </div>
      <div className="fixed bottom-0 w-screen ">
        <Bar.Progress>
          <Bar.ProgressBarBtn isPlaying={isPlaying} 
          onClickPlay={handlePlay} 
          onClickPause={handlePause}
          />
        </Bar.Progress>
      </div>
    </>
  );
}
