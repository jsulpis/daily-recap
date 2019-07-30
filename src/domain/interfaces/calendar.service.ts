import CalendarEvent from "../model/calendar-event";

export default interface CalendarService {
    getEventsOfTheDay(): Promise<CalendarEvent[]>;
    getCalendarName(): string;
}
