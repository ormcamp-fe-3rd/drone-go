import mapboxgl from "mapbox-gl";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { PhaseContext } from "@/contexts/PhaseContext";
import { LatLonAlt } from "@/types/latLonAlt";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import calculateMarkerHeading from "@/utils/calculateMarkerHeading";
import { formatTime } from "@/utils/formatTime";

import ProgressBar from "../map/ProgressBar";
import PlayHead from "./PlayHead";
import ProgressBarBtns from "./ProgressBarBtns";

interface Props {
  positionData: FormattedTelemetryPositionData[] | null;
  stateData:
    | {
        timestamp: Date;
        payload: {
          text: string;
        };
      }[]
    | null;
}

export default function Map2D({ positionData, stateData }: Props) {
  const mapRef = useRef<MapRef>(null); // 맵 인스턴스 접근
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 데이터 관련
  const [latLonAlt, setLatLonAlt] = useState<LatLonAlt[] | null>();
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [startEndTime, setStartEndTime] = useState<{
    startTime: string;
    endTime: string;
  }>({ startTime: "", endTime: "" });
  const [flightStartTime, setFlightStartTime] = useState(0);
  
  // 애니메이션 관련 변수
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const { phase, setPhase } = useContext(PhaseContext);
  const [speed, setSpeed] = useState(1);
  const [headings, setHeadings] = useState<number[]>();
  

  // 경로, 운행시간 셋팅
  useEffect(() => {
    if (!positionData) {
      setLatLonAlt(null);
      return;
    }
    setPhase(0);

    const payloadData: LatLonAlt[] = positionData.map((item) => ({
      lat: item.payload.lat,
      lon: item.payload.lon,
      alt: item.payload.alt,
    }));
    setLatLonAlt(payloadData);

    const calculatedHeadings = calculateMarkerHeading(payloadData);
    setHeadings(calculatedHeadings);


    const flightStartTime = positionData[0].timestamp; // Unix 타임스탬프
    const flightEndTime = positionData[positionData.length - 1].timestamp;
    const formattedStartTime = formatTime(new Date(flightStartTime)); // HH:mm:ss(string 타입)으로 포맷
    const formattedEndTime = formatTime(new Date(flightEndTime));
    setStartEndTime({
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
    setFlightStartTime(flightStartTime);

    setTotalDuration((flightEndTime - flightStartTime) / 1000);

    // 맵 초기화
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.jumpTo({
        center: [positionData[0].payload.lon, positionData[0].payload.lat],
        zoom: 12,
      });

      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({
          element: createMarkerElement("/images/droneMarker.svg"),
        })
          .setLngLat([positionData[0].payload.lon, positionData[0].payload.lat])
          .addTo(map);
      }
    }
  }, [positionData, setPhase, speed]);

  const updateCamera = useCallback(
    (phase: number) => {
      if (!mapRef.current || !latLonAlt || !markerRef.current || !headings)
        return;
      const map = mapRef.current.getMap();

      const currentIndex = Math.min(
        Math.floor(phase * (latLonAlt.length - 1)),
        latLonAlt.length - 1,
      );
      const currentItem = latLonAlt[currentIndex];
      const currentHeading = headings[currentIndex] || 0;

      const markerLngLat: [number, number] = [currentItem.lon, currentItem.lat];
      markerRef.current.setLngLat(markerLngLat);
      markerRef.current.setRotation(currentHeading);

      map.flyTo({
        center: markerLngLat,
        essential: true,
      });
    },
    [headings, latLonAlt],
  );

  //playhead 조작한 경우 elapsedTimeRef 변경
  useEffect(() => {
    elapsedTimeRef.current = phase * totalDuration * 1000;
    updateCamera(phase);
  }, [phase, totalDuration, updateCamera]);

  // play 버튼으로 애니메이션 실행
  const animate = (currentTime: number) => {
    if (!latLonAlt) return;

    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    elapsedTimeRef.current += deltaTime * speed;
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
  
  const addRouteSourceAndLayer = useCallback(() => {
    if (!mapRef.current || !latLonAlt) return;
    
    const map = mapRef.current.getMap();
    const pathCoordinates = latLonAlt.map((point) => [point.lon, point.lat]);
    
    if (map.getSource("route")) {
      map.removeLayer("route-line");
      map.removeSource("route");
    }

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

    setTimeout(() => {
      const source = map.getSource("route") as
        | mapboxgl.GeoJSONSource
        | undefined;
      if (source) {
        source.setData({
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
      }
    }, 500);
  }, [latLonAlt]);

  // 지도 및 마커 초기화
  useEffect(() => {
    if (!mapRef.current || !latLonAlt) return;
    if (!mapLoaded) return;

    const map = mapRef.current.getMap();

    try {
      addRouteSourceAndLayer();
    } catch (error) {
      console.error("Failed to add route: ", error);
    }

    if (!markerRef.current) {
      const initialPoint =
        latLonAlt.length > 0
          ? latLonAlt[0]
          : { lat: 37.572398, lon: 126.976944 };
      const markerLngLat: [number, number] = [
        initialPoint.lon,
        initialPoint.lat,
      ];

      markerRef.current = new mapboxgl.Marker()
        .setLngLat(markerLngLat)
        .addTo(map);
    }

    return () => {
      if (!mapLoaded) return;
      if (map.getLayer("route-line")) {
        map.removeLayer("route-line");
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }
    };
  }, [addRouteSourceAndLayer, latLonAlt, mapLoaded]);

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

  const handlePlaySpeed = (value: string) => {
    setSpeed(Number(value));
  };

  const handleStop = () => {
    setIsPlaying(false);
    setPhase(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    }
  };

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

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
          onLoad={handleMapLoad}
        />
      </div>

      <div className="fixed bottom-0 w-screen">
        <ProgressBar
          startTime={startEndTime.startTime}
          endTime={startEndTime.endTime}
          stateData={stateData}
        >
          <PlayHead
            duration={totalDuration}
            flightStartTime={flightStartTime}
          />
          <ProgressBarBtns
            isPlaying={isPlaying}
            onClickPlay={handlePlay}
            onClickPause={handlePause}
            onChangeSpeed={handlePlaySpeed}
            speed={speed} 
            onClickStop={handleStop}/>
        </ProgressBar>
      </div>
    </>
  );
}
