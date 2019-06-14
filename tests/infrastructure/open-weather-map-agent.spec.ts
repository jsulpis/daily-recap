import OpenWeatherMapAgent from "../../src/infrastructure/open-weather-map-agent";
import axios from "axios";

describe("OpenWeatherMapAgent", () => {
  const mockedAxiosCall = jest.spyOn(axios, "get");

  beforeEach(() => {
    process.env.API_KEY = "hello";
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

    const currentWeather = await new OpenWeatherMapAgent().getCurrentWeather(
      "Lyon",
      "fr"
    );

    const expectedQueryUrl = `${
      OpenWeatherMapAgent.API_URL
    }?q=Lyon,fr&appId=hello`;

    expect(currentWeather.description).toBe("cloudy");
    expect(currentWeather.temperature).toBe(17);
    expect(mockedAxiosCall).toHaveBeenCalledWith(expectedQueryUrl);
  });
});
