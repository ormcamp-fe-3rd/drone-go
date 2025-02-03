import { useEffect, useState } from "react";
import { fetchWeatherData } from "@/api/fetchWeatherData";
import { getWeatherStatus, getWindDirection, getWeatherIcon } from "@/utils/formatWeather";

interface WeatherProps {
  positionData: {
    timestamp: number;
    payload: {
      lat: number;
      lon: number;
    };
  }[] | null;
}

const WeatherWidget = ({ positionData }: WeatherProps) => {
  const [weather, setWeather] = useState<{
    temperature?: number;
    windSpeed?: number;
    windDirection?: number;
    status?: string;
    icon?: string;
  }>({});

  useEffect(() => {
    if (!positionData || positionData.length === 0 || !positionData[0]?.payload) return;

    const { lat, lon } = positionData[0].payload;
    const timestampDate = new Date(positionData[0].timestamp);
    const date = timestampDate.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const loadWeather = async () => {
      const data = await fetchWeatherData(lat, lon, date);
      if (data) {
        const status = getWeatherStatus(data.T2M ?? 0, data.WS10M ?? 0);
        setWeather({
          temperature: data.T2M,
          windSpeed: data.WS10M,
          windDirection: data.WD10M,
          status,
          icon: getWeatherIcon(status),
        });
      }
    };

    loadWeather();
  }, [positionData?.[0]?.timestamp]); // `timestamp` 기준으로 의존성 설정

  if (weather.temperature === undefined) {
    return (
      <div className="relative mx-6 mt-2 h-[5vh] w-[30vw] max-w-[17rem] flex justify-center items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_0.5fr_1fr]">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative mx-6 mt-2 h-[5vh] w-[30vw] max-w-[17rem] grid-cols-[0.5fr_0.5fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_0.5fr_1fr]">
      <div className="flex items-center justify-start border-r-2 border-none border-[#B2B2B7] md:border-solid">
        <img src={weather.icon} alt={weather.status} className="mr-2 h-6 w-6" />
        <p className="hidden h-6 pl-2 md:flex">{weather.status}</p>
      </div>
      <div className="h-6 border-r-2 border-solid border-[#B2B2B7]">
        {weather.temperature}°C
      </div>
      <div className="h-6">
        {weather.windSpeed} m/s ({getWindDirection(weather.windDirection || 0)})
      </div>
    </div>
  );
};

export default WeatherWidget;
