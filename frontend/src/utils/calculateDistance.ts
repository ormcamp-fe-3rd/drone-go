// TelemetryPositionData 타입 선언
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
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  // 유효성 검사: NaN 값이 있으면 계산을 건너뜁니다
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    console.error("Invalid coordinates for haversine calculation", { lat1, lon1, lat2, lon2 });
    return 0; // 잘못된 데이터가 있으면 0을 반환
  }

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
 * @param route 위도, 경도, 고도 데이터를 포함하는 경로 배열
 * @returns 경로의 총 거리 (단위: 미터)
 */
export function calculateDistance(route: TelemetryPositionData[]) {
  let totalDistance = 0;

  if (!route || route.length < 2) {
    console.error("Invalid route data, should have at least two points.");
    return totalDistance; // 잘못된 경로 데이터 처리
  }

  for (let i = 0; i < route.length - 1; i++) {
    const { lat: lat1, lon: lon1 } = route[i].payload;
    const { lat: lat2, lon: lon2 } = route[i + 1].payload;

    // 유효성 검사: NaN 값이 있는지 확인
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      console.error(`Invalid coordinates at index ${i}:`, { lat1, lon1, lat2, lon2 });
      continue; // 유효하지 않은 데이터 건너뜁니다
    }

    totalDistance += haversine(lat1, lon1, lat2, lon2);
  }

  return totalDistance;
}

/**
 * 주어진 경로에서 특정 거리만큼 진행한 지점의 위도, 경도, 고도를 계산
 * @param route 위도, 경도, 고도 데이터를 포함하는 경로 배열
 * @param distanceAlong 경로를 따라 이동한 거리 (단위: 미터)
 * @returns 주어진 거리에서의 지점 (위도, 경도, 고도)
 */
export function calculatePointAlongRoute(
  route: TelemetryPositionData[],
  distanceAlong: number,
): TelemetryPositionData["payload"] {
  if (!route || route.length < 2) {
    console.error("Invalid route data, should have at least two points.");
    return { lat: NaN, lon: NaN, alt: NaN }; // 기본값으로 NaN을 반환
  }

  let coveredDistance = 0; // 현재까지의 누적 거리

  for (let i = 0; i < route.length - 1; i++) {
    const { lat: lat1, lon: lon1, alt: alt1 } = route[i].payload;
    const { lat: lat2, lon: lon2, alt: alt2 } = route[i + 1].payload;

    // 유효성 검사: NaN 값이 있는지 확인
    if (isNaN(lat1) || isNaN(lon1) || isNaN(alt1) || isNaN(lat2) || isNaN(lon2) || isNaN(alt2)) {
      console.error(`Invalid coordinates at index ${i}:`, { lat1, lon1, alt1, lat2, lon2, alt2 });
      continue; // 잘못된 데이터 건너뜁니다
    }

    const segmentDistance = haversine(lat1, lon1, lat2, lon2);

    if (coveredDistance + segmentDistance >= distanceAlong) {
      const remainingDistance = distanceAlong - coveredDistance;
      const ratio = remainingDistance / segmentDistance;

      // 비례적으로 현재 점의 좌표 계산
      const lat = lat1 + (lat2 - lat1) * ratio;
      const lon = lon1 + (lon2 - lon1) * ratio;
      const alt = alt1 + (alt2 - alt1) * ratio;

      // 유효성 검사: 계산된 좌표가 NaN이 아니도록 확인
      if (isNaN(lat) || isNaN(lon) || isNaN(alt)) {
        console.error("Calculated point has invalid coordinates", { lat, lon, alt });
        return route[route.length - 1].payload; // 잘못된 점은 경로의 마지막 점을 반환
      }

      return { lat, lon, alt };
    }

    coveredDistance += segmentDistance;
  }

  return route[route.length - 1].payload; // 경로 끝에 도달하면 마지막 지점 반환
}
