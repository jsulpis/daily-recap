import WeatherData from "../model/weather-data";

export default interface WeatherAgent {
  getCurrentWeather(cityName: string, countryCode: string): Promise<WeatherData>;
}
