interface WeatherData {
  T2M?: number; // 기온 (°C)
  WS10M?: number; // 풍속 (m/s)
  WD10M?: number; // 풍향 (degrees)
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const fetchWeatherData = async (
  latitude: number,
  longitude: number,
  date: string,
): Promise<WeatherData | null> => {
  try {
    console.log(
      `🔍 날씨 데이터 요청: lat=${latitude}, lon=${longitude}, date=${date}`,
    );

    const response = await fetch(
      `${API_BASE_URL}/weather?latitude=${latitude}&longitude=${longitude}&date=${date}`,
    );
    if (!response.ok) throw new Error(`백엔드 응답 오류: ${response.status}`);

    const data = await response.json();
    console.log("🌍 API 응답 데이터:", data);

    if (!data?.T2M || !data?.WS10M || !data?.WD10M) {
      console.warn("⚠️ 유효한 날씨 데이터가 없음.");
      return null;
    }

    return {
      T2M: data.T2M ?? undefined,
      WS10M: data.WS10M ?? undefined,
      WD10M: data.WD10M ?? undefined,
    };
  } catch (error) {
    console.error("❌ 날씨 API 요청 중 오류 발생:", error);
    return null;
  }
};
