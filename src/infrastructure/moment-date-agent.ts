import DateAgent from "../domain/adapters/date-agent";
const moment = require("moment");

export default class MomentDateAgent implements DateAgent {
  getCurrentDate(): string {
    moment.locale("en-US");
    const dateWithTime = moment(Date.now()).format("LLLL");
    // the format of dateWithTime is "dddd D MMMM YYYY HH:mm"
    // I remove the hours using a regex:
    return dateWithTime.replace(/ \d{1,2}:.*/, "");
  }
}
