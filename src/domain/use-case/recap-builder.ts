import DateTimeFormatter from "./date-time-formatter";
import WeatherAgent from "../adapters/weather-agent";
import CalendarAgent from "../adapters/calendar-agent";

export default class RecapBuilder {
  private recap = "";

  private dateTimeFormatter: DateTimeFormatter;
  private weatherAgent: WeatherAgent;
  private calendarAgent: CalendarAgent;

  private cityName: string;
  private countryCode: string;

  constructor() {
    this.dateTimeFormatter = new DateTimeFormatter();
  }

  setName(name: string): RecapBuilder {
    this.recap = this.recap.concat(`Hello ${name}.`);
    return this;
  }

  printCurrentDate(): RecapBuilder {
    const date = this.dateTimeFormatter.formatDate(new Date(Date.now()));
    const time = this.dateTimeFormatter.formatTime(new Date(Date.now()));
    this.recap = this.recap.concat(` It's ${time}, ${date}.`);
    return this;
  }

  printCurrentWeather(
    cityName: string,
    countryCode: string,
    weatherAgent: WeatherAgent
  ): RecapBuilder {
    this.weatherAgent = weatherAgent;
    this.cityName = cityName;
    this.countryCode = countryCode;
    return this;
  }

  printEventsOfTheDay(calendarAgent: CalendarAgent): RecapBuilder {
    this.calendarAgent = calendarAgent;
    return this;
  }

  async build(): Promise<string> {
    if (!!this.weatherAgent) {
      await this.buildWeather();
    }
    if (!!this.calendarAgent) {
      await this.buildEvents();
    }
    return this.recap.trim();
  }

  private async buildWeather() {
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

  private async buildEvents() {
    const events = await this.calendarAgent.getEventsOfTheDay();

    if (events.length === 0) {
      this.recap = this.recap.concat(" You don't have any event today.");
      return;
    }

    const multipleEvents = events.length > 1;
    this.recap = this.recap.concat(
      ` You have ${events.length} event${multipleEvents ? "s" : ""} today: `
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
