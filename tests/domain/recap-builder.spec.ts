import RecapBuilder from "../../src/domain/recap-builder";
import WeatherAgent from "../../src/domain/adapters/weather-agent";

describe("RecapBuilder", () => {
  it("can set the name", () => {
    expect(new RecapBuilder(null, null).setName("World").build()).toBe(
      "Hello World."
    );
    expect(new RecapBuilder(null, null).setName("Julien").build()).toBe(
      "Hello Julien."
    );
  });

  it("can set the date", () => {
    const mockDateAgent = {
      getCurrentDate: () => "Sunday, June 2",
      getCurrentTime: () => "2:30 pm"
    };

    expect(
      new RecapBuilder(mockDateAgent, null).printCurrentDate().build()
    ).toBe("It's 2:30 pm, Sunday, June 2.");
  });

  it("can set the current weather", () => {
    const mockWeatherAgent: WeatherAgent = {
      getCurrentWeather: (cityName, countryCode) =>
        Promise.resolve({ description: "cloudy", temperature: 20 })
    };

    new RecapBuilder(null, mockWeatherAgent)
      .printCurrentWeather("Lyon", "fr")
      .then(builder =>
        expect(builder.build()).toBe(
          "The weather in Lyon is currently cloudy with a temperature of 20 degrees."
        )
      );
  });
});
