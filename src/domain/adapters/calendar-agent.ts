import CalendarEvent from "../model/event";

export default interface CalendarAgent {
  getEventsOfTheDay(): Promise<CalendarEvent[]>;
}
