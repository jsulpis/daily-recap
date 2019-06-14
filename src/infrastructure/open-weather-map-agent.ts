import WeatherAgent from "../domain/adapters/weather-agent";
import axios from "axios";
import Weather from "../domain/model/weather";

export default class OpenWeatherMapAgent implements WeatherAgent {
  static readonly API_URL = "https://api.openweathermap.org/data/2.5/weather";

  getCurrentWeather(cityName: string, countryCode: string): Promise<Weather> {
    return axios
      .get(this.constructQueryUrl(cityName, countryCode))
      .then(response => this.createWeatherModel(response.data));
  }

  private constructQueryUrl(cityName: string, countryCode: string): string {
    return `${OpenWeatherMapAgent.API_URL}?q=${cityName},${countryCode}&appId=${
      process.env.API_KEY
    }`;
  }

  private createWeatherModel(data): Weather {
    return new Weather(
      data.weather[0].description,
      Math.round(this.degreesKelvinToCelcius(data.main.temp))
    );
  }

  private degreesKelvinToCelcius(degreeKelvin: number): number {
    return degreeKelvin - 273.15;
  }
}
