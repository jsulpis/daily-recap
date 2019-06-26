import RecapBuilder from "../../src/domain/use-case/recap-builder";
import WeatherAgent from "../../src/domain/adapters/weather-agent";
import CalendarAgent from "../../src/domain/adapters/calendar-agent";

describe("RecapBuilder", () => {
  it("can set the name", async () => {
    let recap = await new RecapBuilder().setName("World").build();
    expect(recap).toBe("Hello World.");
    recap = await new RecapBuilder().setName("Julien").build();
    expect(recap).toBe("Hello Julien.");
  });

  it("can set the date", async () => {
    const DATE_TEST = new Date("2019-06-02T14:30");
    Date.now = jest.fn(() => DATE_TEST.getTime());

    const recap = await new RecapBuilder()
      .printCurrentDate()
      .build();
    expect(recap).toBe("It's 2:30 pm, Sunday, June 2.");
  });

  it("can set the current weather", async () => {
    const mockWeatherAgent: WeatherAgent = {
      getCurrentWeather: () =>
        Promise.resolve({ description: "cloudy", temperature: 20 })
    };

    const recap = await new RecapBuilder()
      .printCurrentWeather("Lyon", "fr", mockWeatherAgent)
      .build();
    expect(recap).toBe(
      "The weather in Lyon is currently cloudy with a temperature of 20 degrees."
    );
  });

  it("can print one event on the calendar today", async () => {
    const mockCalendarAgent: CalendarAgent = {
      getEventsOfTheDay: () =>
        Promise.resolve([
          {
            title: "Lunch with Bob",
            time: new Date("2019-06-16T12:30")
          }
        ])
    };

    const recap = await new RecapBuilder()
      .printEventsOfTheDay(mockCalendarAgent)
      .build();
    expect(recap).toBe("You have 1 event today: Lunch with Bob at 12:30 pm.");
  });

  it("can print several events on the calendar today", async () => {
    const mockCalendarAgent: CalendarAgent = {
      getEventsOfTheDay: () =>
        Promise.resolve([
          {
            title: "Lunch with Bob",
            time: new Date("2019-06-16T12:30")
          },
          {
            title: "Cello lesson",
            time: new Date("2019-06-16T18:30")
          }
        ])
    };

    const recap = await new RecapBuilder()
      .printEventsOfTheDay(mockCalendarAgent)
      .build();
    expect(recap).toBe(
      "You have 2 events today: Lunch with Bob at 12:30 pm and Cello lesson at 6:30 pm."
    );
  });

  it("should not print the time if the event lasts all day", async () => {
    const mockCalendarAgent: CalendarAgent = {
      getEventsOfTheDay: () =>
        Promise.resolve([
          {
            title: "Ride in the mountain",
            time: null,
            allDay: true
          }
        ])
    };

    const recap = await new RecapBuilder()
      .printEventsOfTheDay(mockCalendarAgent)
      .build();
    expect(recap).toBe(
      "You have 1 event today: Ride in the mountain."
    );
  })
});
