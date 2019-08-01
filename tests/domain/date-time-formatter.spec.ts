import DateTimeFormatter from "../../src/domain/use-case/date-time-formatter";

describe("DateTimeFormatter", () => {
    const TEST_DATE = new Date("2019-06-11T14:30");
    const dateTimeFormatter = new DateTimeFormatter();

    it("should give a date properly formatted in english by default", () => {
        expect(dateTimeFormatter.formatDate(TEST_DATE)).toBe(
            "Tuesday, June 11"
        );
    });

    it("should give a date properly formatted in french", () => {
        expect(dateTimeFormatter.formatDate(TEST_DATE, "fr")).toBe(
            "mardi 11 juin"
        );
    });

    it("should give the current time in 12h format", () => {
        expect(dateTimeFormatter.formatTime12hFormat(TEST_DATE)).toBe(
            "2:30 pm"
        );
    });

    it("should give the current time in 24h format", () => {
        expect(dateTimeFormatter.formatTime24hFormat(TEST_DATE)).toBe("14:30");
    });

    it("should select the time format according to the locale", () => {
        expect(dateTimeFormatter.formatTime(TEST_DATE, "en")).toBe("2:30 pm");
        expect(dateTimeFormatter.formatTime(TEST_DATE, "fr")).toBe("14:30");
        expect(dateTimeFormatter.formatTime(TEST_DATE, "default")).toBe("2:30 pm");
    });
});
