import { Canvas } from "@react-three/fiber";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { fetchPositionDataByOperation } from "@/api/mapApi";

import DroneInMap from "./DroneInMap";

export default function Map3D() {
  const mapRef = useRef<MapRef>(null); //맵 인스턴스 접근
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    map.on("style.load", () => {
      // 지도 스타일이 로드된 후에 추가 작업 수행
      //TODO: 맵 조작
    });

    return () => {
      //
    };
    
  }, [mapRef]);

  //Test
  const operationId = "677730f8e8f8dd840dd35153";
  const robotId = "67773116e8f8dd840dd35155";

  const { isPending, error, data } = useQuery({
    queryKey: ['position'],
    queryFn: () => fetchPositionDataByOperation(robotId, operationId)
  });
  if (isPending) return "Loading";
  if (error) return "An error has occurred: " + error.message;
  console.log(data)

  return (
    <div className="fixed inset-0">
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: 126.97, //경도
          latitude: 37.57, //위도
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
        {/* <TestModel dragPosition={dragPosition} mapRef={mapRef}/> */}
        <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2">
          <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
            <DroneInMap dragPosition={dragPosition} />
          </Canvas>
        </div>
      </Map>
    </div>
  );
}
