import DateAgent from "./adapters/date-agent";
import WeatherAgent from "./adapters/weather-agent";

export default class RecapBuilder {
  private recap = "";
  private dateAgent: DateAgent;
  private weatherAgent: WeatherAgent;

  constructor(dateAgent: DateAgent, weatherAgent: WeatherAgent) {
    this.dateAgent = dateAgent;
    this.weatherAgent = weatherAgent;
  }

  setName(name: string): RecapBuilder {
    this.recap = this.recap.concat(`Hello ${name}.`);
    return this;
  }

  printCurrentDate(): RecapBuilder {
    const date = this.dateAgent.getCurrentDate();
    const time = this.dateAgent.getCurrentTime();
    this.recap = this.recap.concat(` It's ${time}, ${date}.`);
    return this;
  }

  async printCurrentWeather(
    cityName: string,
    countryCode: string
  ): Promise<RecapBuilder> {
    const currentWeather = await this.weatherAgent.getCurrentWeather(
      cityName,
      countryCode
    );

    this.recap = this.recap.concat(
      ` The weather in ${cityName} is currently ${
        currentWeather.description
      } with a temperature of ${currentWeather.temperature} degrees.`
    );
    return this;
  }

  build(): string {
    return this.recap.trim();
  }
}
