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
import ProgressBarBtn from "../map/ProgressBarBtns";

interface Props {
  positionData: FormattedTelemetryPositionData[] | null;
}

export default function Map3D({ positionData }: Props) {
  const mapRef = useRef<MapRef>(null); //맵 인스턴스 접근
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [dronePath, setDronePath] = useState<LatLonAlt[] | null>();
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [startEndTime, setStartEndTime] = useState<{
    startTime: string;
    endTime: string;
  }>({ startTime: "", endTime: "" });
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

    //이동경로 데이터
    const payloadData: LatLonAlt[] = positionData.map((item) => ({
      lat: item.payload.lat,
      lon: item.payload.lon,
      alt: item.payload.alt,
    }));
    setDronePath(payloadData);

    mapRef.current.setCenter([
      positionData[0].payload.lon,
      positionData[0].payload.lat,
    ]);

    //비행시간 설정
    const flightStartTime = positionData[0].timestamp; // Unix 타임스탬프
    const flightEndTime = positionData[positionData.length - 1].timestamp;
    const formattedStartTime = formatTime(new Date(flightStartTime)); // HH:mm:ss(string 타입)으로 포맷
    const formattedEndTime = formatTime(new Date(flightEndTime));
    setStartEndTime({
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
    setFlightStartTime(flightStartTime);
    const totalFlightTime = (flightEndTime - flightStartTime) / 1000;

    setTotalDuration(totalFlightTime / speed);

    //이동경로 라인 추가
    const pathCoordinates = payloadData.map((point) => [point.lon, point.lat]);
    if (mapRef.current.isStyleLoaded()) {
      addRouteSourceAndLayer(pathCoordinates);
    }

    //마커 추가
    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker({
        element: createMarkerElement("/images/droneMarker.svg"),
        rotationAlignment: "map",
      })
        .setLngLat(mapRef.current.getCenter())
        .addTo(mapRef.current.getMap());
    }
  }, [positionData, speed, setPhase]);

  function addRouteSourceAndLayer(pathCoordinates: number[][]) {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
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
  }

  function createMarkerElement(imageUrl: string) {
    const element = document.createElement("img");
    element.src = imageUrl;
    element.style.width = "50px";
    element.style.height = "50px";
    element.style.objectFit = "contain";
    return element;
  }

  const updateCamera = useCallback(() => {
    if (!totalDuration || !dronePath || !mapRef.current || !markerRef.current)
      return;
    const map = mapRef.current!.getMap();
    const routeDistance = calculateDistance(dronePath);

    // 현재 phase에 따른 위치 계산
    const alongPoint = calculatePointAlongRoute(
      dronePath,
      routeDistance * phase || 0.001,
    );

    map.setCenter([alongPoint.lon, alongPoint.lat]);
    const markerLngLat: [number, number] = [alongPoint.lon, alongPoint.lat];
    markerRef.current.setLngLat(markerLngLat);
  }, [totalDuration, dronePath, phase]);

  useEffect(() => {
    elapsedTimeRef.current = phase * totalDuration * 1000;
    updateCamera(); // phase 변경 시 카메라 위치 업데이트
  }, [phase, totalDuration, elapsedTimeRef, updateCamera]);

  const animate = (currentTime: number) => {
    if (!mapRef.current || !dronePath || !positionData) return;

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
            pitch: 50,
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
        ></Map>
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
