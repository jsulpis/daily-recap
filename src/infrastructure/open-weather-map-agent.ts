import WeatherAgent from "../domain/adapters/weather-agent";
import axios from "axios";

export default class OpenWeatherMapAgent implements WeatherAgent {
  static readonly API_URL = "https://api.openweathermap.org/data/2.5/weather";

  getCurrentWeather(cityName: string, countryCode: string): Promise<string> {
    return axios
      .get(this.constructQueryUrl(cityName, countryCode))
      .then(response => response.data.weather[0].description);
  }

  private constructQueryUrl(cityName: string, countryCode: string): string {
    return `${OpenWeatherMapAgent.API_URL}?q=${cityName},${countryCode}&appId=${
      process.env.API_KEY
    }`;
  }
}
