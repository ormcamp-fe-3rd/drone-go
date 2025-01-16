import { useEffect,useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import TestModel from "./TestModel";


export default function Map3D() {
  const mapRef = useRef<MapRef>(null); //맵 인스턴스 접근
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null); 
  const [isDragging, setIsDragging] = useState(false); 


  const handleMouseDown = (event: mapboxgl.MapMouseEvent) => {
    if(event.originalEvent.ctrlKey){
      setIsDragging(true);
    }
  };


  const handleMouseMove = (event: mapboxgl.MapMouseEvent) => {
    if (!isDragging || !mapRef.current) return;

    const point = event.point;
    setDragPosition({ x:point.x, y:point.y });
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
  }, []);
  
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
        <TestModel dragPosition={dragPosition} mapRef={mapRef}/>
      </Map>
    </div>
  );
}
