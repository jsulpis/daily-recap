const moment = require("moment");

export default class DateTimeFormatter {
    public formatDate(date: Date, locale?: string): string {
        moment.locale(locale || "en-US");
        const dateWithTime = moment(date).format("LLLL");
        // the format of dateWithTime is "dddd, D MMMM, YYYY HH:mm"
        // I remove the year and hours using a regex:
        return dateWithTime.replace(/[,]* \d{4}.*/, "");
    }

    public formatTime(date: Date, locale?: string): string {
        switch (locale) {
            case "en" || "en-US" || "en-GB":
                return this.formatTime12hFormat(date);
            case "fr" || "fr-FR":
                return this.formatTime24hFormat(date);
        }
    }

    public formatTime12hFormat(date: Date): string {
        return moment(date)
            .format("hh:mm A")
            .toLowerCase()
            .replace(/^0/, "");
    }

    public formatTime24hFormat(date: Date): string {
        return moment(date).format("HH:mm");
    }
}
