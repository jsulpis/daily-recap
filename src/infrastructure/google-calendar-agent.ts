import CalendarEvent from "../domain/model/calendar-event";
import CalendarAgent from "../domain/adapters/calendar-agent";

export default class GoogleCalendarAgent implements CalendarAgent {
  getEventsOfTheDay(): Promise<CalendarEvent[]> {
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
