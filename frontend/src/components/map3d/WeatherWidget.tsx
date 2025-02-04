import { useEffect, useState, useMemo } from "react";
import { fetchWeatherData } from "@/api/fetchWeatherData";
import {
  getWeatherStatus,
  getWindDirection,
  getWeatherIcon,
} from "@/utils/formatWeather";

interface WeatherProps {
  positionData:
    | {
        timestamp: number;
        payload: {
          lat: number;
          lon: number;
        };
      }[]
    | null;
}

const WeatherWidget = ({ positionData }: WeatherProps) => {
  const [weather, setWeather] = useState<{
    temperature?: number;
    windSpeed?: number;
    windDirection?: number;
    status?: string;
    icon?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const latestPosition = useMemo(() => {
    return positionData && positionData.length > 0
      ? positionData.reduce((latest, curr) =>
          curr.timestamp > latest.timestamp ? curr : latest
        )
      : null;
  }, [positionData]);

  useEffect(() => {
    if (!latestPosition) {
      setIsLoading(false);
      return;
    }

    const { lat, lon } = latestPosition.payload;
    const date = new Date(latestPosition.timestamp).toISOString().split("T")[0]

    console.log(`📍 최신 위치: lat=${lat}, lon=${lon}, date=${date}`);

    const loadWeather = async () => {
      setIsLoading(true);
      const data = await fetchWeatherData(lat, lon, date);

      if (data) {
        const temperature = data.T2M ?? 0;
        const windSpeed = data.WS10M ?? 0;
        const windDirection = data.WD10M ?? 0;
        const status = getWeatherStatus(temperature, windSpeed);
        const icon = getWeatherIcon(status);

        console.log("🌡️ 온도:", temperature, "💨 풍속:", windSpeed, "🧭 풍향:", windDirection);

        setWeather({ temperature, windSpeed, windDirection, status, icon });
      } else {
        setWeather({ temperature: 0, windSpeed: 0, windDirection: 0, status: "정보 없음", icon: "" });
      }
      setIsLoading(false);
    };

    loadWeather();
  }, [latestPosition]);

  if (isLoading) {
    return (
      <div className="relative mx-6 mt-2 flex h-[5vh] w-[30vw] max-w-[17rem] items-center justify-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_0.5fr_1fr]">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative mx-6 mt-2 h-[5vh] w-[30vw] max-w-[17rem] grid-cols-[0.5fr_0.5fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-90 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_0.7fr_0.8fr]">
      <div className="flex items-center border-r-2 border-none border-[#B2B2B7] md:border-solid">
        {weather.icon ? <img src={weather.icon} alt={weather.status} className="mr-2 h-7 w-7" /> : null}
        <p className="hidden h-6 md:flex">{weather.status}</p>
      </div>
      <div className="h-6 border-r-2 border-solid border-[#B2B2B7]">
        {weather.temperature}°C
      </div>
      <div className="h-6 text-right">
        {weather.windSpeed} m/s ({getWindDirection(weather.windDirection || 0)})
      </div>
    </div>
  );
};

export default WeatherWidget;