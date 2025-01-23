import { LatLonAlt } from "@/types/latLonAlt";

const LAT_LON_DIVISOR = 1e7;
const ALT_DIVISOR = 1e3;

export default function formatPositionData(data: LatLonAlt) {
  // TODO: 위도,경도,고도 데이터만 먼저 연결, 추후 전체 데이터 연결
  
  // const formattedPayload = {
  //   lat: data.lat / LAT_LON_DIVISOR,
  //   lon: data.lon / LAT_LON_DIVISOR,
  //   alt: data.alt / ALT_DIVISOR,
  // };
  return {
    // ...data,
    // payload: formattedPayload
    lat: data.lat / LAT_LON_DIVISOR,
    lon: data.lon / LAT_LON_DIVISOR,
    alt: data.alt / ALT_DIVISOR,
  };
}