import WeatherData from "../model/weather-data";

export default interface WeatherService {
  getCurrentWeather(cityName: string, countryCode: string): Promise<WeatherData>;
}
