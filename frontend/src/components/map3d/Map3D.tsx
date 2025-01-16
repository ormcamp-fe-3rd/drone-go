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
      >
        {/* <Marker longitude={126.97} latitude={37.57} anchor="center"> */}
        {/* </Marker> */}
      </Map>
    </div>
  );
}
