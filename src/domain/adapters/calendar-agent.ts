import CalendarEvent from "../model/calendar-event";

export default interface CalendarAgent {
  getEventsOfTheDay(): Promise<CalendarEvent[]>;
}
