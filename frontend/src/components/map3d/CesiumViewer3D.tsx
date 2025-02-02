import * as Cesium from "cesium";
import { useEffect, useRef, useState } from "react";

import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

interface CesiumViewerProps {
  positionData: FormattedTelemetryPositionData[] | null;
}

const CesiumViewer: React.FC<CesiumViewerProps> = ({
  positionData,
}: CesiumViewerProps) => {
  const cesiumContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 첫 번째 useEffect: viewer 초기화
  useEffect(() => {
    if (!cesiumContainerRef.current || isInitialized) return;

    const initViewer = async () => {
      try {
        Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_API_KEY;
        const terrainProvider = await Cesium.createWorldTerrainAsync();

        if (viewerRef.current) {
          viewerRef.current.destroy();
        }
        if(!cesiumContainerRef.current) return;
        viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, {
          terrainProvider,
          imageryProviderViewModels: [
            new Cesium.ProviderViewModel({
              name: "Mapbox",
              iconUrl:
                "https://upload.wikimedia.org/wikipedia/commons/a/a7/Mapbox_logo.svg",
              tooltip: "Mapbox imagery",
              creationFunction: () =>
                new Cesium.MapboxImageryProvider({
                  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
                  mapId: "mapbox.satellite",
                }),
            }),
          ],
          shouldAnimate: false,
          animation: false,
          timeline: false,
          homeButton: false,
          sceneModePicker: false,
          selectionIndicator: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          geocoder: false,
          infoBox: false,
          navigationInstructionsInitiallyVisible: false,
          baseLayerPicker: false,
          vrButton: false,
          projectionPicker: false,
          requestRenderMode: false,
        });

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Cesium:", error);
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      setIsInitialized(false);
    };
  }, []);

  // 두 번째 useEffect: 경로 업데이트
  useEffect(() => {
    if (
      !viewerRef.current ||
      !positionData ||
      !isInitialized ||
      positionData.length === 0
    )
      return;

    // 기존 엔티티 제거
    viewerRef.current.entities.removeAll();

    const pathPositions = positionData.map((item) =>
      Cesium.Cartesian3.fromDegrees(
        item.payload.lon,
        item.payload.lat,
        item.payload.alt,
      ),
    );

    // 초기 카메라 위치 설정
    viewerRef.current.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        positionData[0].payload.lon,
        positionData[0].payload.lat,
        positionData[0].payload.alt + 100,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(10),
        roll: 0,
      },
    });

    // 새 경로 추가
    viewerRef.current.entities.add({
      polyline: {
        positions: pathPositions,
        material: Cesium.Color.BLUE,
        width: 3,
      },
    });
  }, [positionData, isInitialized]);




  return (
    <div
      ref={cesiumContainerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default CesiumViewer;
