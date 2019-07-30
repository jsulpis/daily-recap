export default class WeatherData {
    public description: string;
    public temperature: number;

    constructor(description: string, temperature: number) {
        this.description = description;
        this.temperature = temperature;
    }
}
