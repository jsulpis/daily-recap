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
    const today = this.dateAgent.getCurrentDate();
    this.recap = this.recap.concat(` Today is ${today}.`);
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
      ` The weather in ${cityName} is currently ${currentWeather}`
    );
    return this;
  }

  build(): string {
    return this.recap.trim();
  }
}
