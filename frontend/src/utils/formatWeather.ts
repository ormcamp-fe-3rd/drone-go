export const getWeatherStatus = (temperature: number, windSpeed: number) => {
    if (temperature > 25 && windSpeed < 5) return "Sunny";
    if (temperature < 5) return "Snowy";
    if (windSpeed > 10) return "Windy";
    return "Cloudy";
  };
  
  export const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(degree / 45) % 8];
  };
  
  const weatherIconMap: { [key: string]: string } = {
    "Sunny": "01d",
    "Cloudy": "02d",
    "Windy": "50d",
    "Snowy": "13d",
  };
  
  export const getWeatherIcon = (status: string) =>
    `https://openweathermap.org/img/wn/${weatherIconMap[status]}.png`;
  