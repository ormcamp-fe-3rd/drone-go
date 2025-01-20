import { Canvas } from "@react-three/fiber";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import latLonData from "@/data/latLonData.json"
import { calculateDistance, calculatePointAlongRoute } from "@/utils/calculateDistance";

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
    // const testDistance = calculateDistance(latLonData);
    // const testPoint = calculatePointAlongRoute(latLonData, testDistance * 0.5);
    // console.log("Test distance:", testDistance);
    // console.log("Test point:", testPoint);
      let animationFrameId:number;
      const animationDuration = 8000;
      const cameraAltitude = 600;
      const routeDistance = calculateDistance(latLonData)
      console.log(routeDistance);
      
      let start: DOMHighResTimeStamp;
      function frame(time: DOMHighResTimeStamp) {
        if (!start) start = time;
        let phase = (time - start) / animationDuration; // 0에서 1 사이의 비율
        
        if (phase > 1) {
          start = time;
          phase = 0;
        }
        
        const alongPoint = calculatePointAlongRoute(latLonData, routeDistance * phase);
        const alongRoute = [alongPoint[1], alongPoint[0]];  // 순서 변경
        const alongCamera = [alongPoint[1], alongPoint[0]];
        
        const camera = map.getFreeCameraOptions();
        
        // set the position and altitude of the camera
        camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
          {
            lng: alongCamera[0],
            lat: alongCamera[1],
          },
          cameraAltitude,
        );
        camera.lookAtPoint({
          lng: alongRoute[0],
          lat: alongRoute[1],
        });
        
        map.setFreeCameraOptions(camera);
        
        animationFrameId = window.requestAnimationFrame(frame);
        
      }
      animationFrameId = window.requestAnimationFrame(frame);
      

    return () => {
      //
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
    
  }, [mapRef]);


  return (
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
