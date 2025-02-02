import mapboxgl from "mapbox-gl";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { PhaseContext } from "@/contexts/PhaseContext";
import { LatLonAlt } from "@/types/latLonAlt";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";


interface Props {
  positionData: FormattedTelemetryPositionData[]|null;
}

export default function MiniMap({ positionData }: Props) {
  const mapRef = useRef<MapRef>(null); 
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [latLonAlt, setLatLonAlt] = useState<LatLonAlt[] | null>();
  const { phase } = useContext(PhaseContext);


  useEffect(()=>{
    if (!positionData) return;
    setLatLonAlt(
      positionData.map((item) => ({
        lat: item.payload.lat,
        lon: item.payload.lon,
        alt: item.payload.alt,
      })),
    );

    // 맵 초기화
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.jumpTo({
        center: [positionData[0].payload.lon, positionData[0].payload.lat],
        zoom: 12,
      });
    }
  },[positionData])


  const updateCamera = useCallback(() => {
    if (!mapRef.current || !latLonAlt || latLonAlt.length === 0) return;

    const map = mapRef.current.getMap();

    const currentIndex = Math.floor(phase * (latLonAlt.length - 1));
    const currentPoint = latLonAlt[currentIndex];

    const markerLngLat: [number, number] = [currentPoint.lon, currentPoint.lat];

    // 마커 업데이트
    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker()
        .setLngLat(markerLngLat)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(markerLngLat);
    }

    // 지도 카메라 업데이트
    map.flyTo({
      center: markerLngLat,
      zoom: 12,
      essential: true,
    });
  }, [latLonAlt, phase]);


  useEffect(() => {
    updateCamera(); // phase가 변경될 때마다 카메라 업데이트
  }, [phase, updateCamera]);


  // // 지도 및 마커 
  useEffect(() => {
    if (mapRef.current && latLonAlt) {
      const map = mapRef.current.getMap();

      const pathCoordinates = latLonAlt.map((point) => [point.lon, point.lat]);

      const addRouteSourceAndLayer = () => {
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
      }}

      // 스타일 로드 완료 후 source와 layer 추가
      if (map.isStyleLoaded()) {
        addRouteSourceAndLayer();
      } else {
        map.once("styledata", addRouteSourceAndLayer);
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
    };
  }, [latLonAlt]);

  return (
    <>
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
        style={{ width: "100%", height: "100%", borderRadius: "10px", borderWidth:"2px", borderColor:"white" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        boxZoom={false}
        doubleClickZoom={false}
        dragPan={true} //드래그 이동 가능
        keyboard={false}
        scrollZoom={true} //스크롤 확대 가능
        touchPitch={false}
        touchZoomRotate={false}
        dragRotate={false}
      />
    </>
  );
}
