export default interface WeatherAgent {
  getCurrentWeather(cityName: string, countryCode: string): Promise<string>;
}
