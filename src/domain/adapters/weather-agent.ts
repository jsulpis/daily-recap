import Weather from "../model/weather";

export default interface WeatherAgent {
  getCurrentWeather(cityName: string, countryCode: string): Promise<Weather>;
}
