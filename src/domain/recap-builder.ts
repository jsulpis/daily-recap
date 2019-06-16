import DateAgent from "./adapters/date-agent";
import WeatherAgent from "./adapters/weather-agent";
import CalendarAgent from "./adapters/calendar-agent";
const moment = require("moment");

export default class RecapBuilder {
  private recap = "";

  private dateAgent: DateAgent;
  private weatherAgent: WeatherAgent;
  private calendarAgent: CalendarAgent;

  private cityName: string;
  private countryCode: string;

  setName(name: string): RecapBuilder {
    this.recap = this.recap.concat(`Hello ${name}.`);
    return this;
  }

  printCurrentDate(dateAgent: DateAgent): RecapBuilder {
    this.dateAgent = dateAgent;
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
    if (!!this.dateAgent) {
      this.buildDate();
    }
    if (!!this.weatherAgent) {
      await this.buildWeather();
    }
    if (!!this.calendarAgent) {
      await this.buildEvents();
    }
    return this.recap.trim();
  }

  private buildDate() {
    const date = this.dateAgent.getCurrentDate();
    const time = this.dateAgent.getCurrentTime();
    this.recap = this.recap.concat(` It's ${time}, ${date}.`);
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
    const multipleEvents = events.length > 1;
    this.recap = this.recap.concat(
      ` You have ${events.length} event${multipleEvents ? "s" : ""} today: `
    );
    events.forEach(event => {
      const time = moment(event.time)
        .format("hh:mm A")
        .toLowerCase()
        .replace(/^0/, "");
      this.recap = this.recap.concat(`${event.title} at ${time} and `);
    });
    this.recap = this.recap.replace(/ and $/, '.');
  }
}
