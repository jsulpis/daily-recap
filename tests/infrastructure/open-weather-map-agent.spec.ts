import OpenWeatherMapAgent from "../../src/infrastructure/open-weather-map-agent";
import axios from "axios";

describe("OpenWeatherMapAgent", () => {
  beforeEach(() => {
    process.env.API_KEY = "hello"
  });

  it("should return the current weather", async () => {
    const mockedAxiosCall = jest.spyOn(axios, "get");
    mockedAxiosCall.mockResolvedValue({
      data: {
        weather: [{ description: "cloudy" }]
      }
    });

    const currentWeather = await new OpenWeatherMapAgent().getCurrentWeather(
      "Lyon",
      "fr"
    );

    const expectedQueryUrl = `${OpenWeatherMapAgent.API_URL}?q=Lyon,fr&appId=hello`

    expect(currentWeather).toBe("cloudy");
    expect(mockedAxiosCall).toHaveBeenCalledWith(expectedQueryUrl)
  });
});
