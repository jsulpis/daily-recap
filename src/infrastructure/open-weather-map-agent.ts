import WeatherAgent from "../domain/adapters/weather-agent";
import axios from "axios";
import WeatherData from "../domain/model/weather-data";

export default class OpenWeatherMapAgent implements WeatherAgent {
  static readonly API_URL = "https://api.openweathermap.org/data/2.5/weather";

  getCurrentWeather(cityName: string, countryCode: string): Promise<WeatherData> {
    return axios
      .get(this.constructQueryUrl(cityName, countryCode))
      .then(response => this.createWeatherModel(response.data));
  }

  private constructQueryUrl(cityName: string, countryCode: string): string {
    return `${OpenWeatherMapAgent.API_URL}?q=${cityName},${countryCode}&appId=${
      process.env.API_KEY
    }`;
  }

  private createWeatherModel(data): WeatherData {
    return new WeatherData(
      data.weather[0].description,
      Math.round(this.degreesKelvinToCelcius(data.main.temp))
    );
  }

  private degreesKelvinToCelcius(degreeKelvin: number): number {
    return degreeKelvin - 273.15;
  }
}
