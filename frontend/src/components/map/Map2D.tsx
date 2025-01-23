import { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

// GeoJSON 타입 정의
interface PointFeature {
  type: 'Feature';
  properties: { bearing?: number }; // 회전 각도
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [경도, 위도]
  };
}

interface LineStringFeature {
  type: 'Feature';
  properties: { name?: string }; // 예시 속성 추가
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [경도, 위도] 배열
  };
}

interface FeatureCollection<T> {
  type: 'FeatureCollection';
  features: T[];
}

const Map2D: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // 맵 컨테이너
  const mapRef = useRef<Map | null>(null); // Map 객체
  const pointRef = useRef<FeatureCollection<PointFeature> | null>(null); // 드론 위치
  const originRef = useRef<[number, number] | null>(null); // 드론의 시작 위치
  const routeRef = useRef<FeatureCollection<LineStringFeature> | null>(null); // 경로 데이터
  const [disabled, setDisabled] = useState<boolean>(true); // 버튼 비활성화 상태
  const steps = 500; // 애니메이션 단계 수
  let counter = 0;

  // 클릭 이벤트: 경로를 따라 드론이 이동
  const handleClick = () => {
    if (!pointRef.current || !originRef.current || !mapRef.current) return;

    pointRef.current.features[0].geometry.coordinates = originRef.current;
    const pointSource = mapRef.current.getSource('point') as mapboxgl.GeoJSONSource;
    pointSource?.setData(pointRef.current);
    animate(); // 애니메이션 시작
    setDisabled(true); // 버튼 비활성화
  };

  // 애니메이션 함수
  const animate = () => {
    if (!routeRef.current || !pointRef.current) return;

    const start =
      routeRef.current.features[0].geometry.coordinates[
        counter >= steps ? counter - 1 : counter
      ];
    const end =
      routeRef.current.features[0].geometry.coordinates[
        counter >= steps ? counter : counter + 1
      ];

    if (!start || !end) {
      setDisabled(false); // 애니메이션 종료 후 버튼 활성화
      return;
    }

    pointRef.current.features[0].geometry.coordinates =
      routeRef.current.features[0].geometry.coordinates[counter];
    pointRef.current.features[0].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    const pointSource = mapRef.current?.getSource('point') as mapboxgl.GeoJSONSource;
    pointSource?.setData(pointRef.current); // 마커 위치 업데이트

    if (counter < steps) {
      counter++; // `counter` 증가
      requestAnimationFrame(animate); // 계속 애니메이션
    } else {
      setDisabled(false); // 애니메이션 종료 후 버튼 활성화
    }
  };

  useEffect(() => {
    // Mapbox 초기화
    mapboxgl.accessToken = 'pk.eyJ1IjoianliYW4iLCJhIjoiY201eHN2OTgxMDZ3NjJpcjNobXUxOTgxdCJ9.xVU25Wom44OGgaM3EmScUg'; // Mapbox 액세스 토큰 설정
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/dark-v11', // 지도 스타일
      center: [-96, 37.8], // 지도 초기 중심
      zoom: 3, // 초기 줌 레벨
      pitch: 40, // 초기 기울기
    });

    // 드론의 초기 위치 설정
    const origin: [number, number] = [-122.414, 37.776];
    originRef.current = origin;

    const destination: [number, number] = [-77.032, 38.913];

    // 경로 설정 (위도/경도 데이터 사용)
    const route: FeatureCollection<LineStringFeature> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Sample Route' }, // 예시 속성 추가
          geometry: {
            type: 'LineString',
            coordinates: [origin, destination],
          },
        },
      ],
    };
    routeRef.current = route;

    // 드론 초기 위치 설정 (경로의 첫 번째 지점)
    const point: FeatureCollection<PointFeature> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: origin,
          },
        },
      ],
    };
    pointRef.current = point;

    // 경로 길이에 따른 분할
    const lineDistance = turf.length(route.features[0]);
    const arc: [number, number][] = [];

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(route.features[0], i);
      arc.push(segment.geometry.coordinates as [number, number]); // 타입 안전하게 지정
    }

    route.features[0].geometry.coordinates = arc; // 경로를 분할

    mapRef.current?.on('load', () => {
      // mapRef.current가 null이 아닐 때만 호출하도록 처리
      if (mapRef.current) {
        mapRef.current.addSource('route', {
          type: 'geojson',
          data: route,
        });

        mapRef.current.addSource('point', {
          type: 'geojson',
          data: point,
        });

        // 경로 레이어 추가
        mapRef.current.addLayer({
          id: 'route',
          source: 'route',
          type: 'line',
          paint: {
            'line-width': 2,
            'line-color': '#007cbf',
          },
        });

        // 드론 마커 레이어 추가
        mapRef.current.addLayer({
          id: 'point',
          source: 'point',
          type: 'symbol',
          layout: {
            'icon-image': 'airport', // 사용자 정의 아이콘 사용
            'icon-size': 1.5,
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
        });

        animate(); // 애니메이션 시작
      }
    });

    // Cleanup
    return () => mapRef.current?.remove();
  }, []);

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <button
          disabled={disabled}
          style={{
            backgroundColor: disabled ? '#f5f5f5' : '#3386c0',
            color: disabled ? '#c3c3c3' : '#fff',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '3px',
          }}
          onClick={handleClick}
          id="replay"
        >
          Replay
        </button>
      </div>
    </div>
  );
};

export default Map2D;
