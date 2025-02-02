import mapboxgl from "mapbox-gl";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { PhaseContext } from "@/contexts/PhaseContext";
import { Telemetry2dPayloadSubset } from "@/types/telemetry2dDataTypes";
import { formatAndSortPositionData } from "@/utils/formatPositionData";
import { calculateDistance, calculatePointAlongRoute } from "@/utils/calculateDistance";
import { formatTime } from "@/utils/formatTime";

import ProgressBar from "../map/ProgressBar";
import PlayHead from "./PlayHead";
import ProgressBarBtn from "./ProgressBarBtn";

interface Props {
  positionData: ReturnType<typeof formatAndSortPositionData> | null;
}

export default function Map2D({ positionData }: Props) {
  const mapRef = useRef<MapRef>(null); // 맵 인스턴스 접근
  const [latLonAlt, setLatLonAlt] = useState<Telemetry2dPayloadSubset<"lat" | "lon" | "alt">[] | null>(null);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [startEndTime, setStartEndTime] = useState<{
    startTime: string;
    endTime: string;
  }>({startTime: "", endTime: ""});
  const [flightStartTime, setFlightStartTime] = useState(0);
  const { phase, setPhase } = useContext(PhaseContext);
  const [speed, setSpeed] = useState(1);
  
  // 애니메이션 관련 변수
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // 경로, 운행시간 셋팅
  useEffect(() => {
    if (!mapRef.current || !positionData) return;
    setPhase(0);
  
    const payloadData: Telemetry2dPayloadSubset<"lat" | "lon" | "alt">[] = positionData.map((item) => ({
      lat: item.payload.lat,
      lon: item.payload.lon,
      alt: item.payload.alt,
    }));
    setLatLonAlt(payloadData);
  
    mapRef.current.setCenter([
      positionData[0]?.payload?.lon ?? 0,
      positionData[0]?.payload?.lat ?? 0,
    ]);
  
    const flightStartTime = positionData[0]?.timestamp ?? "데이터 없음"; // Unix 타임스탬프
    const flightEndTime = positionData[positionData.length - 1]?.timestamp ?? "데이터 없음";
    const formattedStartTime = formatTime(new Date(flightStartTime)); // HH:mm:ss(string 타입)으로 포맷
    const formattedEndTime = formatTime(new Date(flightEndTime));
    setStartEndTime({
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
    setFlightStartTime(flightStartTime);

    const totalFlightTime = (flightEndTime - flightStartTime)/1000;
    setTotalDuration(totalFlightTime/speed);

  }, [positionData, setPhase, speed]);


  const updateCamera = useCallback((phaseValue: number )=> {
    if (!mapRef.current || !latLonAlt || !markerRef.current) return;
    const map = mapRef.current.getMap();

    const totalDistance = calculateDistance(latLonAlt);
    const alongPoint = calculatePointAlongRoute(
      latLonAlt,
      totalDistance * phaseValue || 0.001,
    );
    
    const markerLngLat: [number, number] = [alongPoint.lon ?? 0, alongPoint.lat ?? 0];
    markerRef.current.setLngLat(markerLngLat);
    
    map.flyTo({
      center: markerLngLat,
      zoom: 12,
      essential: true,
    });
  },[latLonAlt])


  //playhead 조작한 경우 elapsedTimeRef 변경
  useEffect(()=>{
    elapsedTimeRef.current = phase * totalDuration * 1000;
    updateCamera(phase);
  },[phase, totalDuration, updateCamera]);


  // play 버튼으로 애니메이션 실행
  const animate = (currentTime: number) => {
    if (!latLonAlt) return;

    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    elapsedTimeRef.current += deltaTime;
    lastTimeRef.current = currentTime;

    const animationDuration = totalDuration * 1000; // 단위: 밀리초

    const phase = Math.min(1, elapsedTimeRef.current / animationDuration);
    
    updateCamera(phase);
    setPhase(phase);

    if (phase >= 1) {
      setIsPlaying(false);
      setPhase(0);
      lastTimeRef.current = 0;
      elapsedTimeRef.current = 0;
      return;
    }
    animationRef.current = window.requestAnimationFrame(animate);
  };

  // 지도 및 마커 초기화
  useEffect(() => {
    if (!mapRef.current || !latLonAlt) return;
  
    const map = mapRef.current.getMap();
  
    const initialPoint =
      latLonAlt.length > 0
        ? latLonAlt[0]
        : { lat: 37.572398, lon: 126.976944 }; // 서울 기본값
  
    // 초기 맵 위치 설정
    map.jumpTo({
      center: [initialPoint.lon ?? 0, initialPoint.lat ?? 0],
      zoom: 12,
    });
  
    const pathCoordinates = latLonAlt
      .filter((point) => point.lon !== null && point.lat !== null)
      .map((point) => [point.lon as number, point.lat as number]);
  
    // 🔹 경로 데이터 업데이트 함수
    const updateRouteSource = () => {
      if (map.getSource("route")) {
        (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: pathCoordinates,
              },
              properties: {},
            },
          ],
        });
      } else {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: pathCoordinates,
                },
                properties: {},
              },
            ],
          },
        });
  
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-width": 4,
            "line-color": "#007cbf",
          },
        });
      }
    };
  
    // 🔹 스타일 로딩 확인 후 데이터 업데이트 실행
    if (map.isStyleLoaded()) {
      updateRouteSource();
    } else {
      map.once("style.load", () => {
        console.log("✅ 스타일 로딩 완료! 데이터 업데이트 실행");
        updateRouteSource();
      });
    }
  
    // 🔹 마커 추가
    if (!markerRef.current) {
      const initialMarkerPoint =
        latLonAlt.length > 0
          ? latLonAlt[0]
          : { lat: 37.572398, lon: 126.976944 };
      const markerLngLat: [number, number] = [
        initialMarkerPoint.lon ?? 0,
        initialMarkerPoint.lat ?? 0,
      ];
  
      markerRef.current = new mapboxgl.Marker({
        element: createMarkerElement("/images/Group 906.svg"),
      })
        .setLngLat(markerLngLat)
        .addTo(map);
    }
  }, [latLonAlt]);
  

  function createMarkerElement(imageUrl: string) {
    const element = document.createElement("img");
    element.src = imageUrl;
    element.style.width = "50px";
    element.style.height = "50px";
    element.style.objectFit = "contain";
    return element;
  }


  const handlePlay = () => {
    setIsPlaying(true);
    lastTimeRef.current = 0; 
    animationRef.current = window.requestAnimationFrame(animate);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0; 
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
            longitude: 126.976944, // 경도
            latitude: 37.572398, // 위도
            zoom: 12,
            pitch: 0,
            bearing: 0,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        />
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
