import DateTimeFormatter from "./date-time-formatter";
import WeatherAgent from "../interfaces/weather-agent";
import CalendarAgent from "../interfaces/calendar-agent";

export default class RecapBuilder {
  private recap = "";

  private dateTimeFormatter: DateTimeFormatter;
  private weatherAgent: WeatherAgent;
  private calendarAgents: CalendarAgent[] = [];

  private cityName: string;
  private countryCode: string;

  constructor() {
    this.dateTimeFormatter = new DateTimeFormatter();
  }

  sayHello(name: string): RecapBuilder {
    this.recap = this.recap.concat(`Hello ${name}.`);
    return this;
  }

  sayCurrentDate(): RecapBuilder {
    const date = this.dateTimeFormatter.formatDate(new Date(Date.now()));
    const time = this.dateTimeFormatter.formatTime(new Date(Date.now()));
    this.recap = this.recap.concat(` It's ${time}, ${date}.`);
    return this;
  }

  sayCurrentWeather(
    cityName: string,
    countryCode: string,
    weatherAgent: WeatherAgent
  ): RecapBuilder {
    this.weatherAgent = weatherAgent;
    this.cityName = cityName;
    this.countryCode = countryCode;
    return this;
  }

  listEventsOfTheDay(calendarAgent: CalendarAgent): RecapBuilder {
    this.calendarAgents.push(calendarAgent);
    return this;
  }

  async build(): Promise<string> {
    if (!!this.weatherAgent) {
      await this.buildWeather();
    }
    for (const agent of this.calendarAgents) {
      await this.buildEvents(agent);
    }

    return this.recap.trim();
  }

  private async buildWeather(): Promise<void> {
    const currentWeather = await this.weatherAgent.getCurrentWeather(
      this.cityName,
      this.countryCode
    );
    this.recap = this.recap.concat(
      ` The weather in ${this.cityName} is currently ${
        currentWeather.description
      } with a temperature of ${currentWeather.temperature} degrees.`
    );
  }

  private async buildEvents(calendarAgent: CalendarAgent): Promise<void> {
    let events;
    try {
      events = await calendarAgent.getEventsOfTheDay();
    } catch (err) {
      return console.error(err);
    }

    if (events.length === 0) {
      this.recap = this.recap.concat(
        ` You don't have any event on your ${calendarAgent.getCalendarName()} agenda today.`.replace(
          /  /,
          " "
        )
      );
      return;
    }

    const multipleEvents = events.length > 1;
    this.recap = this.recap.concat(
      ` You have ${events.length} event${
        multipleEvents ? "s" : ""
      } on your ${calendarAgent.getCalendarName()} agenda today: `.replace(
        /  /,
        " "
      )
    );
    events.forEach(event => {
      this.recap = this.recap.concat(event.title);
      if (!event.allDay) {
        const time = this.dateTimeFormatter.formatTime(event.time);
        this.recap = this.recap.concat(` at ${time}`);
      }
      this.recap = this.recap.concat(" and ");
    });
    this.recap = this.recap.replace(/ and $/, ".");
  }
}
