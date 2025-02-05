import mapboxgl from "mapbox-gl";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { PhaseContext } from "@/contexts/PhaseContext";
import { LatLonAlt } from "@/types/latLonAlt";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import calculateMarkerHeading from "@/utils/calculateMarkerHeading";


interface Props {
  positionData: FormattedTelemetryPositionData[]|null;
}

export default function MiniMap({ positionData }: Props) {
  const mapRef = useRef<MapRef>(null); 
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [latLonAlt, setLatLonAlt] = useState<LatLonAlt[] | null>();
  const { phase } = useContext(PhaseContext);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [headings, setHeadings] = useState<number[]>();

  useEffect(()=>{
    if (!positionData) {
      setLatLonAlt(null);
      return;
    }
    
    const paylodData = positionData.map((item) => ({
      lat: item.payload.lat,
      lon: item.payload.lon,
      alt: item.payload.alt,
    }));
    setLatLonAlt(paylodData);

    const calculatedHeadings = calculateMarkerHeading(paylodData);
    setHeadings(calculatedHeadings);

    // 맵 초기화
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.jumpTo({
        center: [positionData[0].payload.lon, positionData[0].payload.lat],
        zoom: 12,
      });

      if(!markerRef.current){
        markerRef.current = new mapboxgl.Marker({
          element: createMarkerElement("/images/droneMarker.svg"),
        })
        .setLngLat([positionData[0].payload.lon, positionData[0].payload.lat])
        .addTo(map);
      }
    }
  },[positionData])


  const updateCamera = useCallback(() => {
    if (!mapRef.current || !latLonAlt || !headings ||!markerRef.current) return;

    const map = mapRef.current.getMap();

    const currentIndex = Math.min(
      Math.floor(phase * (latLonAlt.length - 1)),
      latLonAlt.length - 1,
    );
    const currentPoint = latLonAlt[currentIndex];
    const currentHeading = headings[currentIndex] || 0;

    const markerLngLat: [number, number] = [currentPoint.lon, currentPoint.lat];
    markerRef.current.setLngLat(markerLngLat);
    markerRef.current.setRotation(currentHeading);

    map.flyTo({
      center: markerLngLat,
      essential: true,
    });
  }, [headings, latLonAlt, phase]);


  useEffect(() => {
    updateCamera();// phase가 변경될 때마다 카메라 업데이트
  }, [phase, updateCamera]);
  
  
  const addRouteSourceAndLayer = useCallback(() => {
    if(!mapRef.current || !latLonAlt) return;
    
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
    const source = map.getSource("route") as mapboxgl.GeoJSONSource | undefined;
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
},[latLonAlt])

// 지도 및 마커 
useEffect(() => {
  if (!mapRef.current || !latLonAlt ) return;
  if(!mapLoaded) return;
  
  const map = mapRef.current.getMap();
  
  try{
    addRouteSourceAndLayer()
  } catch (error){
    console.error("Failed to add route: ", error)
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
    if(!mapLoaded) return;
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
      element.style.width = "40px";
      element.style.height = "40px";
      element.style.objectFit = "contain";
      return element;
    }
  
  const handleMapLoad = useCallback(() => {
    setMapLoaded(true)
  },[])

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
        onLoad={handleMapLoad}
      />
    </>
  );
}
