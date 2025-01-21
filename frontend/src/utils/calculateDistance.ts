// 위도, 경도 배열 예시
// const targetRoute: number[][] = [
//   [40.77, -73.97], // 첫 번째 지점 (위도, 경도)
//   [40.78, -73.98], // 두 번째 지점
//   [40.79, -73.99], // 세 번째 지점
// ];

// Haversine 공식으로 두 지점 간의 거리를 계산하는 함수
//lat 위도, lon 경도
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

  return R * c; // 결과는 미터 단위
}

// 경로의 총 거리를 계산하는 함수
export function calculateDistance(route: number[][]) {
  let totalDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const [lat1, lon1] = route[i];
    const [lat2, lon2] = route[i + 1];

    totalDistance += haversine(lat1, lon1, lat2, lon2);
  }

  return totalDistance; //미터 단위
}

// 경로에서 특정 거리만큼 이동한 지점을 계산하는 함수
export function calculatePointAlongRoute(
  route: number[][],
  distanceAlong: number,
): number[]{
  let coveredDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const [lat1, lon1] = route[i];
    const [lat2, lon2] = route[i + 1];
    const segmentDistance = haversine(lat1, lon1, lat2, lon2); // 두 점 사이 거리 계산 (미터 단위)

    if (coveredDistance + segmentDistance >= distanceAlong) {
      const remainingDistance = distanceAlong - coveredDistance;
      const ratio = remainingDistance / segmentDistance;

      // 비례적으로 현재 점의 좌표 계산
      const lat = lat1 + (lat2 - lat1) * ratio;
      const lon = lon1 + (lon2 - lon1) * ratio;

      return [lat, lon];
    }

    coveredDistance += segmentDistance;
  }

  // 반환 값이 없을 경우 마지막 점 반환
  return route[route.length - 1];
}