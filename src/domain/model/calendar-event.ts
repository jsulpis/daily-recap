export default class CalendarEvent {
  title: string;
  time: Date;

  constructor(title: string, time: Date){
    this.title = title, this.time = time;
  }
}
