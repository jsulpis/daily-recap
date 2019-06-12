import DateAgent from "./date-agent";

export default class RecapBuilder {
  private recap = "";
  private dateAgent: DateAgent;

  constructor(dateAgent: DateAgent) {
    this.dateAgent = dateAgent;
  }

  setName(name: string): RecapBuilder {
    this.recap = this.recap.concat(`Hello ${name}.`);
    return this;
  }

  printCurrentDate(): RecapBuilder {
    const today = this.dateAgent.getCurrentDateInSpokenLanguage();
    this.recap = this.recap.concat(` Today is ${today}.`);
    return this;
  }

  build(): string {
    return this.recap.trim();
  }
}
