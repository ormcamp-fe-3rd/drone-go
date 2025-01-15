import { useEffect,useRef } from "react";
import Map, { MapRef } from "react-map-gl";


export default function Map3D() {
  const mapRef = useRef<MapRef>(null); //맵 인스턴스 접근

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.on("style.load", () => {
      // 지도 스타일이 로드된 후에 추가 작업 수행
      //TODO: 맵 조작
    });
  }, []);
  
  return (
    <div className="fixed inset-0">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 17,
          pitch: 45,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/standard"
      />
    </div>
  );
}
