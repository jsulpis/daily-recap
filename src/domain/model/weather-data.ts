export default class WeatherData {
  description: string;
  temperature: number;

  constructor(description: string, temperature: number) {
    this.description = description;
    this.temperature = temperature;
  }
}
