import OpenWeatherMapService from "../../src/infrastructure/open-weather-map.service";
import Axios from "axios";

describe("OpenWeatherMapService", () => {
    const mockedAxiosCall = jest.spyOn(Axios, "get");

    beforeEach(() => {
        process.env.OPEN_WEATHER_API_KEY = "hello";
    });

    it("should return the current weather in the specified city", async () => {
        mockedAxiosCall.mockResolvedValue({
            data: {
                weather: [{ description: "cloudy" }],
                main: {
                    temp: 290
                }
            }
        });

        const currentWeather = await new OpenWeatherMapService().getCurrentWeather(
            "Lyon",
            "fr",
            "fr"
        );

        expect(currentWeather.description).toBe("cloudy");
        expect(currentWeather.temperature).toBe(17);
        expect(mockedAxiosCall).toHaveBeenCalledWith(
            OpenWeatherMapService.API_URL,
            {
                params: {
                    appId: process.env.OPEN_WEATHER_API_KEY,
                    q: "Lyon,fr",
                    lang: "fr"
                }
            }
        );
    });
});
