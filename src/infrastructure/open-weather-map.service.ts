import Axios from "axios";
import WeatherService from "../domain/interfaces/weather.service";
import WeatherData from "../domain/model/weather-data";

export default class OpenWeatherMapService implements WeatherService {
    public static readonly API_URL =
        "https://api.openweathermap.org/data/2.5/weather";

    public getCurrentWeather(
        cityName: string,
        countryCode: string
    ): Promise<WeatherData> {
        return Axios.get(this.constructQueryUrl(cityName, countryCode)).then(
            response => this.createWeatherModel(response.data)
        );
    }

    private constructQueryUrl(cityName: string, countryCode: string): string {
        return `${OpenWeatherMapService.API_URL}?q=${cityName},${countryCode}&appId=${process.env.OPEN_WEATHER_API_KEY}`;
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
