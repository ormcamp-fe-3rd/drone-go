import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

interface CesiumViewerProps {
  latLonAltData: { lat: number; lon: number; alt: number }[];
}

const CesiumViewer: React.FC<CesiumViewerProps> = ({ latLonAltData }) => {
  const cesiumContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null); // Cesium Viewer 인스턴스

  useEffect(() => {
    const initializeCesium = async () => {
      if (cesiumContainerRef.current) {
        // 비동기 호출로 terrainProvider 설정
        const terrainProvider = await Cesium.createWorldTerrainAsync();

        // Mapbox ImageryProvider 설정
        viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, {
          terrainProvider, // 비동기 호출로 terrainProvider 설정
          imageryProviderViewModels: [
            new Cesium.ProviderViewModel({
              name: 'Mapbox',
              iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Mapbox_logo.svg', // 아이콘 URL 추가
              tooltip: 'Mapbox imagery', // Tooltip 추가
              creationFunction: () => new Cesium.MapboxImageryProvider({
                accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN, // Mapbox API Key
                mapId: 'mapbox.satellite', // 예시: Satellite 스타일
              }),
            }),
          ],
          selectedImageryProviderViewModel: new Cesium.ProviderViewModel({
            name: 'Mapbox',
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Mapbox_logo.svg', // 아이콘 URL 추가
            tooltip: 'Mapbox imagery', // Tooltip 추가
            creationFunction: () => new Cesium.MapboxImageryProvider({
              accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN, // Mapbox API Key
              mapId: 'mapbox.satellite', // 예시: Satellite 스타일
            }),
          }),
          shouldAnimate: true, // 애니메이션 활성화
        });

        // 초기 위치 설정
        const initialPosition = Cesium.Cartesian3.fromDegrees(
          latLonAltData[0].lon,
          latLonAltData[0].lat,
          latLonAltData[0].alt
        );
        viewerRef.current.camera.setView({
          destination: initialPosition, // 첫 번째 인자는 destination
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-30),
            roll: 0,
          }, // 두 번째 인자는 orientation
        });

        // 경로 추가 (이동 경로 시각화)
        const pathPositions = latLonAltData.map((data) =>
          Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.alt)
        );

        // polyline을 Entity로 추가
        viewerRef.current.entities.add({
          polyline: {
            positions: pathPositions,
            material: Cesium.Color.RED,
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
      }
    };
  }, [latLonAltData]);

  return (
    <div
      ref={cesiumContainerRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    ></div>
  );
};

export default CesiumViewer;
