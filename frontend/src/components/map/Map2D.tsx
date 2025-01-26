import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Map, { MapRef } from "react-map-gl";
import { TelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import { calculateDistance, calculatePointAlongRoute } from "@/utils/calculateDistance";
import { Bar } from "../map/ProgressBar";

interface Props {
  telemetryPositionData: TelemetryPositionData[];
}

export default function Map2D({ telemetryPositionData }: Props) {
  const mapRef = useRef<MapRef>(null); // 맵 인스턴스 접근

  // 애니메이션 관련 변수
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // 애니메이션 실행
  const animate = (currentTime: number) => {
    if (!mapRef.current || !mapRef.current.getMap || !markerRef.current || telemetryPositionData.length === 0) {
      console.error("telemetryPositionData is empty or invalid!");
      return;
    }

    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    elapsedTimeRef.current += deltaTime;
    lastTimeRef.current = currentTime;

    const animationDuration = 8000;
    const phase = Math.min(1, elapsedTimeRef.current / animationDuration);

    if (phase >= 1) {
      setIsPlaying(false);
      elapsedTimeRef.current = 0;
      lastTimeRef.current = 0;
    }

    const totalDistance = calculateDistance(telemetryPositionData);
    console.log("Total distance:", totalDistance);

    const alongPoint = calculatePointAlongRoute(telemetryPositionData, totalDistance * phase);

    if (isNaN(alongPoint.lat) || isNaN(alongPoint.lon)) {
      console.error(`Invalid coordinates: {lat: ${alongPoint.lat}, lon: ${alongPoint.lon}}`);
      alongPoint.lat = 37.572398;
      alongPoint.lon = 126.976944;
    }

    console.log(`Animating to: {lat: ${alongPoint.lat}, lon: ${alongPoint.lon}}`);

    const markerLngLat: [number, number] = [alongPoint.lon, alongPoint.lat];

    if (markerRef.current) {
      markerRef.current.setLngLat(markerLngLat);
    }

    if (phase >= 1 && mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: markerLngLat,
        zoom: 12,
        essential: true,
      });
    }

    if (phase < 1) {
      animationRef.current = window.requestAnimationFrame(animate);
    }
  };

  const handlePlay = () => {
    lastTimeRef.current = 0;
    setIsPlaying(true);
    animationRef.current = window.requestAnimationFrame(animate);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    }
  };

  // 지도 및 마커 초기화
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();

      const initialPoint = telemetryPositionData.length > 0
        ? telemetryPositionData[0].payload
        : { lat: 37.572398, lon: 126.976944 };

      map.jumpTo({
        center: [initialPoint.lon, initialPoint.lat],
        zoom: 12,
      });

      const pathCoordinates = telemetryPositionData.map((point) => [point.payload.lon, point.payload.lat]);

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

      if (!markerRef.current) {
        const initialPoint = telemetryPositionData.length > 0
          ? telemetryPositionData[0].payload
          : { lat: 37.572398, lon: 126.976944 };

        const markerLngLat: [number, number] = [initialPoint.lon, initialPoint.lat];

        markerRef.current = new mapboxgl.Marker({
          element: createMarkerElement('/public/images/group 906.svg'),
        })
          .setLngLat(markerLngLat)
          .addTo(map);
      }

      // 애니메이션 시작
      if (isPlaying) {
        const totalDistance = calculateDistance(telemetryPositionData);
        const alongPoint = calculatePointAlongRoute(telemetryPositionData, 0);
        if (markerRef.current) {
          markerRef.current.setLngLat([alongPoint.lon, alongPoint.lat]);
        }
        animationRef.current = window.requestAnimationFrame(animate);
        console.log(totalDistance);
      }
    }

    return () => {
      if (mapRef.current && animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [telemetryPositionData, isPlaying]);

  function createMarkerElement(imageUrl: string) {
    const element = document.createElement("img");
    element.src = imageUrl;
    element.style.width = "50px";
    element.style.height = "50px";
    element.style.objectFit = "contain";
    return element;
  }

  return (
    <>
      <div className="fixed inset-0">
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: 126.976944, // 경도
            latitude: 37.572398, // 위도
            zoom: 14,
            pitch: 0,
            bearing: 0,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          boxZoom={false}
          doubleClickZoom={false}
          dragPan={false}
          keyboard={false}
          scrollZoom={false}
          touchPitch={false}
          touchZoomRotate={false}
          dragRotate={true}
        />
      </div>

      <div className="fixed bottom-0 w-screen">
        <Bar.Progress>
          <Bar.ProgressBarBtn
            isPlaying={isPlaying}
            onClickPlay={handlePlay}
            onClickPause={handlePause}
          />
        </Bar.Progress>
      </div>
    </>
  );
}
