export const getWeatherStatus = (temperature: number, windSpeed: number) => {
    if (temperature > 25 && windSpeed < 5) return "맑음";
    if (temperature < 5) return "눈 가능성 있음";
    if (windSpeed > 10) return "바람 많음";
    return "흐림";
  };
  
  export const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(degree / 45) % 8];
  };
  
  const weatherIconMap: { [key: string]: string } = {
    "맑음": "01d",
    "흐림": "02d",
    "바람 많음": "50d",
    "눈 가능성 있음": "13d",
  };
  
  export const getWeatherIcon = (status: string) =>
    `https://openweathermap.org/img/wn/${weatherIconMap[status]}.png`;
  