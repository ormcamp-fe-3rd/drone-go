// utils/formatPositionData.ts
import { GetTelemetries200Item, TelemetryPayload } from "@/api/generatedClient";  // 오발에서 생성된 타입

// TelemetryPositionData 타입을 정의
export interface TelemetryPositionData {
  timestamp: Date;  // 타임스탬프
  payload: {
    lat: number;
    lon: number;
    alt: number;
  };
}

const LAT_LON_DIVISOR = 1e7;  // 위도, 경도에 대한 나누기 값
const ALT_DIVISOR = 1e3;      // 고도에 대한 나누기 값

/**
 * 오발에서 받은 GetTelemetries200Item 데이터를 포맷팅하여 TelemetryPositionData로 변환
 * @param data - GetTelemetries200Item 데이터 (오발로 받은 원시 데이터)
 * @returns 포맷팅된 텔레메트리 데이터 (TelemetryPositionData)
 */
export default function formatPositionData(data: GetTelemetries200Item): TelemetryPositionData {
  // data.payload가 존재하면 해당 값으로, 없으면 기본값으로 처리
  const payload: TelemetryPayload = data.payload || {};

  // payload의 필드들이 있을 경우, 이를 포맷팅하여 반환
  const formattedPayload = {
    lat: payload.lat !== undefined ? payload.lat / LAT_LON_DIVISOR : 0,  // 위도
    lon: payload.lon !== undefined ? payload.lon / LAT_LON_DIVISOR : 0,  // 경도
    alt: payload.alt !== undefined ? payload.alt / ALT_DIVISOR : 0,      // 고도
  };

  // timestamp가 undefined, null, 빈 객체({})가 아닐 때에만 new Date() 사용
  let timestamp: Date;
  if (data.timestamp && (typeof data.timestamp === 'string' || typeof data.timestamp === 'number' || data.timestamp instanceof Date)) {
    timestamp = new Date(data.timestamp);
  } else {
    timestamp = new Date();  // 유효하지 않으면 현재 시간
  }

  console.log("Formatted Payload:", formattedPayload);  // 포맷팅된 데이터 출력

  return {
    timestamp,  // 타임스탬프 추가
    payload: formattedPayload,  // 포맷팅된 payload 반환
  };
}
