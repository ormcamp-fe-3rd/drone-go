import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Map, { MapRef } from "react-map-gl";
import { TelemetryPositionData, calculateDistance, calculatePointAlongRoute } from "@/utils/calculateDistance";
import { Bar } from "../map/ProgressBar";

interface Props {
  formatPositionData: TelemetryPositionData[]; // TelemetryPositionData 타입 사용
}

export default function Map2D({ formatPositionData }: Props) {
  const mapRef = useRef<MapRef>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const animate = (currentTime: number) => {
    if (!mapRef.current || !mapRef.current.getMap || !markerRef.current || formatPositionData.length === 0) {
      console.error("formatPositionData is empty or invalid!");
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

    const totalDistance = calculateDistance(formatPositionData);
    console.log("Total distance:", totalDistance);

    // calculatePointAlongRoute 함수 호출 전에 payload를 안전하게 처리
    const validData = formatPositionData.filter((point) => point.payload?.lat && point.payload?.lon);

    if (validData.length === 0) {
      console.error("No valid data available to calculate point along route.");
      return;
    }

    const alongPoint = calculatePointAlongRoute(validData, totalDistance * phase);

    const lat = alongPoint?.lat ?? 37.572398;  // 기본 위도값
    const lon = alongPoint?.lon ?? 126.976944; // 기본 경도값
    const alt = alongPoint?.alt ?? 0;          // 기본 고도값

    console.log(`Animating to: {lat: ${lat}, lon: ${lon}, alt: ${alt}}`);

    const markerLngLat: [number, number] = [lon, lat];

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

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();

      // 첫 번째 지점의 lat, lon 값 확인 및 기본값 제공
      const initialPoint = formatPositionData.length > 0 && formatPositionData[0].payload
        ? formatPositionData[0].payload
        : { lat: 37.572398, lon: 126.976944 };

      map.jumpTo({
        center: [initialPoint.lon, initialPoint.lat],
        zoom: 12,
      });

      const pathCoordinates = formatPositionData.map((point) => [
        point.payload?.lon ?? 0,  // 경도가 없으면 기본값 0 사용
        point.payload?.lat ?? 0,  // 위도가 없으면 기본값 0 사용
      ]);

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
        const initialPoint = formatPositionData.length > 0 && formatPositionData[0].payload
          ? formatPositionData[0].payload
          : { lat: 37.572398, lon: 126.976944 };

        const markerLngLat: [number, number] = [initialPoint.lon, initialPoint.lat];

        markerRef.current = new mapboxgl.Marker({
          element: createMarkerElement('/public/images/group 906.svg'),
        })
          .setLngLat(markerLngLat)
          .addTo(map);
      }

      if (isPlaying) {
        const totalDistance = calculateDistance(formatPositionData);
        // payload가 유효한 데이터만 필터링하여 사용
        const validData = formatPositionData.filter((point) => point.payload?.lat && point.payload?.lon);
        if (validData.length === 0) {
          console.error("No valid data available to start animation.");
          return;
        }
        const alongPoint = calculatePointAlongRoute(validData, 0);
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
  }, [formatPositionData, isPlaying]);

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
            longitude: 126.976944,
            latitude: 37.572398,
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
