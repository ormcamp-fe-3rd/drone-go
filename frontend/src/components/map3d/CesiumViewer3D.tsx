import * as Cesium from 'cesium';
import { useEffect, useRef, useState } from 'react';

import { LatLonAlt } from '@/types/latLonAlt';
import { FormattedTelemetryPositionData } from '@/types/telemetryPositionDataTypes';

interface CesiumViewerProps {
  positionData: FormattedTelemetryPositionData[] | null;
}

const CesiumViewer: React.FC<CesiumViewerProps> = ({ positionData }: CesiumViewerProps) => {
  const cesiumContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null); // Cesium Viewer 인스턴스
  const [dronePath, setDronePath] = useState<LatLonAlt[] | null>();
  
  useEffect(()=> {
    if(!positionData) return;
    const payloadData: LatLonAlt[] = positionData.map((item) => ({
          lat: item.payload.lat,
          lon: item.payload.lon,
          alt: item.payload.alt,
        }));
    setDronePath(payloadData);
  },[positionData])

  useEffect(() => {
    if (!dronePath || viewerRef.current) return;

    const initializeCesium = async () => {
      if (cesiumContainerRef.current) {
        Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_API_KEY; 
        // 비동기 호출로 terrainProvider 설정
        const terrainProvider = await Cesium.createWorldTerrainAsync();

        // Mapbox ImageryProvider 설정
        viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, {
          terrainProvider, // 비동기 호출로 terrainProvider 설정
          imageryProviderViewModels: [
            new Cesium.ProviderViewModel({
              name: "Mapbox",
              iconUrl:
                "https://upload.wikimedia.org/wikipedia/commons/a/a7/Mapbox_logo.svg", // 아이콘 URL 추가
              tooltip: "Mapbox imagery", // Tooltip 추가
              creationFunction: () =>
                new Cesium.MapboxImageryProvider({
                  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN, // Mapbox API Key
                  mapId: "mapbox.satellite", // 예시: Satellite 스타일
                }),
            }),
          ],
          // selectedImageryProviderViewModel: new Cesium.ProviderViewModel({
          //   name: 'Mapbox',
          //   iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Mapbox_logo.svg', // 아이콘 URL 추가
          //   tooltip: 'Mapbox imagery', // Tooltip 추가
          //   creationFunction: () => new Cesium.MapboxImageryProvider({
          //     accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN, // Mapbox API Key
          //     mapId: 'mapbox.satellite', // 예시: Satellite 스타일
          //   }),
          // }),
          shouldAnimate: false, // 애니메이션 활성화
          animation: false,
          timeline: false, // 타임라인 숨기기
          homeButton: false, // 홈 버튼 숨기기
          sceneModePicker: false, // 씬 모드 선택 버튼 숨기기
          selectionIndicator: false, // 선택 표시 숨기기
          navigationHelpButton: false, // 네비게이션 도움말 버튼 숨기기
          fullscreenButton: false, // 전체 화면 버튼 숨기기
          geocoder: false, // 위치 검색 숨기기
          infoBox: false, // 인포박스 숨기기
          // clock: false, // 시계 숨기기
          navigationInstructionsInitiallyVisible: false, // 내비게이션 도움말 숨기기
          baseLayerPicker: false,
          vrButton: false,
          projectionPicker: false,
          requestRenderMode: false,
        });

        // 초기 위치 설정
        const initialPosition = Cesium.Cartesian3.fromDegrees(
          dronePath[0].lon,
          dronePath[0].lat,
          dronePath[0].alt,
        );

        // const offset = new Cesium.Cartesian3(0, -100, 50); // 뒤로 100m, 위로 100m 이동

        // viewerRef.current.camera.lookAt(initialPosition, offset);
        viewerRef.current.camera.setView({
          destination: initialPosition,
          orientation: {
            heading: Cesium.Math.toRadians(0), // 동쪽을 바라보도록 설정 (기본값: 0)
            pitch: Cesium.Math.toRadians(10), // 아래를 45도 각도로 내려다보도록 설정
            roll: 0, // 기울기 없음
          },
        });

        // 경로 추가 (이동 경로 시각화)
        const pathPositions = dronePath.map((data) =>
          Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.alt),
        );

        // polyline을 Entity로 추가
        viewerRef.current.entities.add({
          polyline: {
            positions: pathPositions,
            material: Cesium.Color.BLUE,
            width: 3,
          },
        });
      }
    };
  

    // 초기화 함수 실행
    initializeCesium();

    // Cleanup: Viewer 종료
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy(); // Cesium Viewer 종료
        viewerRef.current = null;
      }
    };
  }, [dronePath]);

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
    ></div>
  );
};

export default CesiumViewer;
