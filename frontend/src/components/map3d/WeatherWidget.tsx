import { useEffect, useMemo,useState } from "react";

import { fetchWeatherData } from "@/api/fetchWeatherData";
import {
  getWeatherIcon,
  getWeatherStatus,
  getWindDirection,
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
          curr.timestamp > latest.timestamp ? curr : latest,
        )
      : null;
  }, [positionData, positionData?.map((p) => p.timestamp)]);

  useEffect(() => {
    if (!latestPosition) {
      setIsLoading(false);
      return;
    }

    const { lat, lon } = latestPosition.payload;
    const date = new Date(latestPosition.timestamp).toISOString().split("T")[0];

    const loadWeather = async () => {
      setIsLoading(true);
      const data = await fetchWeatherData(lat, lon, date);

      if (data) {
        const temperature = data.T2M ?? 0;
        const windSpeed = data.WS10M ?? 0;
        const windDirection = data.WD10M ?? 0;
        const status = getWeatherStatus(temperature, windSpeed);
        const icon = getWeatherIcon(status);

        const windSpeedInKmh = windSpeed * 3.6; // m/s -> km/h

        setWeather({
          temperature,
          windSpeed: windSpeedInKmh,
          windDirection,
          status,
          icon,
        });
      } else {
        setWeather({
          temperature: 0,
          windSpeed: 0,
          windDirection: 0,
          status: "정보 없음",
          icon: "",
        });
      }
      setIsLoading(false);
    };

    loadWeather();
  }, [latestPosition?.timestamp]);

  if (isLoading) {
    return (
      <div className="relative mx-6 mt-2 flex h-[5vh] w-[30vw] max-w-[19rem] items-center justify-center rounded-[10px] bg-white bg-opacity-90 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_0.5fr_1fr]">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative mx-6 mt-2 h-[5vh] w-[30vw] hidden max-w-[19rem] grid-cols-[0.5fr_0.5fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-80 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_0.5fr_1fr]">
      <div className="flex items-center border-r-2 border-none border-[#B2B2B7] md:border-solid">
        {weather.icon ? (
          <img
            src={weather.icon}
            alt={weather.status}
            className="mr-2 h-7 sm:w-7"
          />
        ) : null}
        <p className="hidden h-6 md:flex">{weather.status}</p>
      </div>
      <div className="h-6 border-r-2 border-solid border-[#B2B2B7]">
        {weather.temperature}°C
      </div>
      <div className="h-6 text-right">
        {weather.windSpeed} km/h ({getWindDirection(weather.windDirection || 0)}
        )
      </div>
    </div>
  );
};

export default WeatherWidget;
