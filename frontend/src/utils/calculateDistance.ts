export interface TelemetryPositionData {
  timestamp: Date;
  payload: {
    lat: number;
    lon: number;
    alt: number;
  };
}

/**
 * Haversine 공식으로 두 지점 간의 거리를 계산하는 함수
 *
 * @param lat1 첫 번째 지점의 위도 (단위: 도)
 * @param lon1 첫 번째 지점의 경도 (단위: 도)
 * @param lat2 두 번째 지점의 위도 (단위: 도)
 * @param lon2 두 번째 지점의 경도 (단위: 도)
 * @returns 두 지점 간의 거리 (단위: 미터)
 */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // 지구 반지름 (단위: 미터)

  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 경로의 총 거리를 계산하는 함수
 * @param route TelemetryPositionData 배열
 * @returns 경로의 총 거리 (단위: 미터)
 */
export function calculateDistance(route: TelemetryPositionData[]): number {
  let totalDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const { lat: lat1, lon: lon1 } = route[i].payload;
    const { lat: lat2, lon: lon2 } = route[i + 1].payload;

    totalDistance += haversine(lat1, lon1, lat2, lon2);
  }

  console.log(`Total distance: ${totalDistance}`);
  return totalDistance;
}

/**
 * 주어진 경로에서 특정 거리만큼 진행한 지점의 위도, 경도, 고도 계산
 * @param route TelemetryPositionData 배열
 * @param distanceAlong 경로를 따라 이동한 거리 (단위: 미터)
 * @returns 주어진 거리에서의 지점 (위도, 경도, 고도)
 */
export function calculatePointAlongRoute(
  route: TelemetryPositionData[],
  distanceAlong: number,
): TelemetryPositionData["payload"] {
  let coveredDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const { lat: lat1, lon: lon1, alt: alt1 } = route[i].payload;
    const { lat: lat2, lon: lon2, alt: alt2 } = route[i + 1].payload;

    const segmentDistance = haversine(lat1, lon1, lat2, lon2);

    // 라우트 데이터 유효성 검사
    if (!route || route.length < 2) {
      console.error("유효하지 않은 라우트 데이터");
      return route[0].payload;
    }

    if (coveredDistance + segmentDistance >= distanceAlong) {
      const remainingDistance = distanceAlong - coveredDistance;
      const ratio = remainingDistance / segmentDistance;

      // 비례적으로 현재 점의 좌표 계산
      const lat = lat1 + (lat2 - lat1) * ratio;
      const lon = lon1 + (lon2 - lon1) * ratio;
      const alt = alt1 + (alt2 - alt1) * ratio;

      // 디버깅: 계산된 위도, 경도, 고도 출력
      console.log(`At distance ${distanceAlong}, calculated coordinates: lat: ${lat}, lon: ${lon}, alt: ${alt}`);

      // 유효성 검사: NaN 값이 있을 경우 경로의 마지막 점을 반환
      if (isNaN(lat) || isNaN(lon) || isNaN(alt)) {
        console.error(`Invalid coordinates at distance ${distanceAlong}. Returning last valid point.`);
        return route[route.length - 1].payload;
      }

      return { lat, lon, alt };
    }

    coveredDistance += segmentDistance;
  }

  // 디버깅: 마지막 지점 반환 시 좌표 출력
  console.log(`Returning last point: lat: ${route[route.length - 1].payload.lat}, lon: ${route[route.length - 1].payload.lon}, alt: ${route[route.length - 1].payload.alt}`);
  return route[route.length - 1].payload; // 경로 끝에 도달하면 마지막 지점 반환
}
