const moment = require("moment");

export default class DateTimeFormatter {
    formatDate(date: Date): string {
        moment.locale("en-US");
        const dateWithTime = moment(date).format("LLLL");
        // the format of dateWithTime is "dddd, D MMMM, YYYY HH:mm"
        // I remove the year and hours using a regex:
        return dateWithTime.replace(/, \d{4}.*/, "");
    }

    formatTime(date: Date): string {
        return moment(date)
            .format("hh:mm A")
            .toLowerCase()
            .replace(/^0/, "");
    }
}
