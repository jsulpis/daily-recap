import CalendarAgent from "../../src/domain/adapters/calendar-agent";

export default class GoogleCalendarAgent implements CalendarAgent {
  getEventsOfTheDay(): Promise<
    import("../../src/domain/model/event").default[]
  > {
    return Promise.resolve([
      {
        title: "Lunch with Bob",
        time: new Date("2019-06-16T12:30")
      },
      {
        title: "Cello lesson",
        time: new Date("2019-06-16T18:30")
      }
    ]);
  }
}
