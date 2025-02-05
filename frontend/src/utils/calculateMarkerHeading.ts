import { LatLonAlt } from "@/types/latLonAlt";

function calculateHeading(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const lat1Rad = lat1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);
  const lon1Rad = lon1 * (Math.PI / 180);
  const lon2Rad = lon2 * (Math.PI / 180);

  const x = Math.sin(lon2Rad - lon1Rad) * Math.cos(lat2Rad);
  const y =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);

  const heading = Math.atan2(x, y) * (180 / Math.PI); 
  return (heading + 360) % 360; // 0~360 범위로 보정
}

// 헤딩 계산을 위한 반복문 함수
export default function calculateMarkerHeading(positionData: LatLonAlt[]) {
  const headings = [];
  for (let i = 0; i < positionData.length - 1; i++) {
    const { lat: lat1, lon: lon1 } = positionData[i];
    const { lat: lat2, lon: lon2 } = positionData[i + 1];
    const heading = calculateHeading(lat1, lon1, lat2, lon2);
    headings.push(heading);
  }
  return headings;
}
