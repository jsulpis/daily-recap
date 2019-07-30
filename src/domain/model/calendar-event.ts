export default class CalendarEvent {
    public title: string;
    public time: Date;
    public allDay?: boolean;

    constructor(title: string, time: Date, allDay: boolean = false) {
        this.title = title;
        this.time = time;
        this.allDay = allDay;
    }
}
