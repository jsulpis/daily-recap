import Axios from "axios";
import WeatherService from "../domain/interfaces/weather.service";
import WeatherData from "../domain/model/weather-data";

export default class OpenWeatherMapService implements WeatherService {
    public static readonly API_URL =
        "https://api.openweathermap.org/data/2.5/weather";

    public getCurrentWeather(
        cityName: string,
        countryCode: string,
        locale: string
    ): Promise<WeatherData> {
        return Axios.get(OpenWeatherMapService.API_URL, {
            params: {
                appId: process.env.OPEN_WEATHER_API_KEY,
                q: `${cityName},${countryCode}`,
                lang: locale
            }
        }).then(response => this.createWeatherModel(response.data));
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
