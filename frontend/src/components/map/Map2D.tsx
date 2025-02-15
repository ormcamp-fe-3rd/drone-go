import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";

import { PhaseContext } from "@/contexts/PhaseContext";
import { useAnimationTime } from "@/hooks/useAnimationTime";
import { LatLonAlt } from "@/types/latLonAlt";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";
import { addMapSourceLayerMarker } from "@/utils/addMapSourceLayerMarker";
import calculateMarkerHeading from "@/utils/calculateMarkerHeading";

import ProgressBar from "../map/ProgressBar";
import PlayHead from "./PlayHead";
import ProgressBarBtns from "./ProgressBarBtns";

interface Props {
  positionData: FormattedTelemetryPositionData[] | null;
}

export default function Map2D({ positionData }: Props) {
  const mapRef = useRef<MapRef>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [latLonAlt, setLatLonAlt] = useState<LatLonAlt[] | null>();
  const [headings, setHeadings] = useState<number[]>();
  const { phase, setPhase } = useContext(PhaseContext);
  
  const { 
    isPlaying, speed, elapsedTimeRef,
    handlePlay, handlePause, handleStop, handlePlaySpeed,
    totalDuration, startEndTime, flightStartTime,
  } = useAnimationTime({
    positionData: positionData, 
    onUpdate: (progress) => {
      setPhase(progress);
    }})
    
  // 지도 및 마커 초기화
  useEffect(() => {
    if (!mapRef.current || !latLonAlt) return;
    if (!mapLoaded) return;

    const map = mapRef.current.getMap();
  
    try {
      addMapSourceLayerMarker(mapRef, latLonAlt, positionData, markerRef);
    } catch (error) {
      console.error("Failed to add route: ", error);
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
  }, [latLonAlt, mapLoaded, positionData]);
  
  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);
    
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


    // 맵 초기화
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.jumpTo({
        center: [positionData[0].payload.lon, positionData[0].payload.lat],
      });
    }
  }, [positionData, setPhase]);

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
  }, [elapsedTimeRef, phase, totalDuration, updateCamera]);



  return (
    <>
      <div className="fixed inset-0">
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: 126.976944, // 경도
            latitude: 37.572398, // 위도
            zoom: 13,
            pitch: 0,
            bearing: 0,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onLoad={handleMapLoad}
        />
      </div>

      <div className="fixed bottom-10 w-screen">
        <ProgressBar
          startTime={startEndTime.startTime}
          endTime={startEndTime.endTime}
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
            onClickStop={handleStop}
          />
        </ProgressBar>
      </div>
    </>
  );
}
