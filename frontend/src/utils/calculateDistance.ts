/**
 * 위도, 경도 배열 예시:
 *
 * @example
 * const targetRoute: LatLon[] = [
 *   [40.77, -73.97], // 첫 번째 지점 (위도, 경도)
 *   [40.78, -73.98], // 두 번째 지점
 *   [40.79, -73.99], // 세 번째 지점
 * ];
 */

import { LatLonAlt } from "@/types/latLonAlt";

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
 * @param route 위도, 경도 쌍의 배열로 이루어진 경로
 * @returns 경로의 총 거리 (단위: 미터)
 */
export function calculateDistance(route: LatLonAlt[]) {
  let totalDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const { lat: lat1, lon: lon1 } = route[i];
    const { lat: lat2, lon: lon2 } = route[i + 1];

    totalDistance += haversine(lat1, lon1, lat2, lon2);
  }

  return totalDistance;
}

/**
 * 
 * @param route 위도와 경도의 배열로 이루어진 경로([[위도1, 경도1], [위도2, 경도2], ...])
 * @param distanceAlong 경로를 따라 이동한 거리 (단위: 미터)
 * @returns 주어진 거리(distanceAlong)에서의 지점(위도와 경도 배열), 지점을 찾을 수 없는 경우 마지막 경로 반환
 */
export function calculatePointAlongRoute(
  route: LatLonAlt[],
  distanceAlong: number,
): LatLonAlt {
  let coveredDistance = 0; //현재까지의 누적 거리

  for (let i = 0; i < route.length - 1; i++) {
    const { lat: lat1, lon: lon1, alt: alt1 } = route[i];
    const { lat: lat2, lon: lon2, alt: alt2 } = route[i + 1];
    const segmentDistance = haversine(lat1, lon1, lat2, lon2);

    if (coveredDistance + segmentDistance >= distanceAlong) {
      // distancdAlong 에 도달한 경우
      const remainingDistance = distanceAlong - coveredDistance;
      const ratio = remainingDistance / segmentDistance;

      // 비례적으로 현재 점의 좌표 계산
      const lat = lat1 + (lat2 - lat1) * ratio;
      const lon = lon1 + (lon2 - lon1) * ratio;
      const alt = alt1 + (alt2 - alt1) * ratio;

      return { lat, lon, alt };
    }

    coveredDistance += segmentDistance;
  }

  return route[route.length - 1];
}
