import nasaApiClient from "@/api/nasaApiClient";

interface WeatherData {
  T2M?: number; // 기온 (°C)
  WS10M?: number; // 풍속 (m/s)
  WD10M?: number; // 풍향 (degrees)
}

// 중복 요청 방지
const pendingRequests = new Map<string, Promise<WeatherData | null>>();

/**
 * 🌤️ 특정 좌표와 날짜에 대한 날씨 데이터를 가져옴.
 * @param latitude 위도
 * @param longitude 경도
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns WeatherData | null
 */

export const fetchWeatherData = async (
  latitude: number,
  longitude: number,
  date: string
): Promise<WeatherData | null> => {
  try {
    const cacheKey = `${latitude}-${longitude}-${date}`;

    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      console.log(`🟢 캐시된 날씨 데이터 사용: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    // 중복 요청 방지
    if (pendingRequests.has(cacheKey)) {
      console.log(`⏳ 중복 요청 방지: ${cacheKey}`);
      return pendingRequests.get(cacheKey)!;
    }

    console.log(`🔍 날씨 데이터 요청: lat=${latitude}, lon=${longitude}, date=${date}`);

    const requestPromise = nasaApiClient
      .get("/weather", {
        params: { latitude, longitude, date },
      })
      .then((response) => {
        console.log("📡 API 응답 데이터:", response.data);

        const weatherData = response.data?.properties?.parameter;
        if (!weatherData) {
          console.warn("⚠️ properties.parameter에서 유효한 날씨 데이터를 찾을 수 없음.");
          return null;
        }

        const parsedData: WeatherData = {
          T2M: weatherData.T2M?.[date] ?? undefined,
          WS10M: weatherData.WS10M?.[date] ?? undefined,
          WD10M: weatherData.WD10M?.[date] ?? undefined,
        };

        // 중복 요청 방지지
        sessionStorage.setItem(cacheKey, JSON.stringify(parsedData));

        return parsedData;
      })
      .catch((error) => {
        console.error("❌ 날씨 API 요청 중 오류 발생:", error);
        return null;
      })
      .finally(() => {
        pendingRequests.delete(cacheKey);
      });

    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  } catch (error) {
    console.error("❌ 예기치 않은 오류:", error);
    return null;
  }
};