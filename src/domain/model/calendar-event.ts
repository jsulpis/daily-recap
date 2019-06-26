export default class CalendarEvent {
  title: string;
  time: Date;
  allDay?: boolean;

  constructor(title: string, time: Date, allDay: boolean = false){
    this.title = title;
    this.time = time;
    this.allDay = allDay;
  }
}
