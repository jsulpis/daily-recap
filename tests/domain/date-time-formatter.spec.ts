import DateTimeFormatter from "../../src/domain/use-case/date-time-formatter";

describe("DateTimeFormatter", () => {
    const TEST_DATE = new Date("2019-06-11T14:30");

    it("gives a date properly formatted", () => {
        expect(new DateTimeFormatter().formatDate(TEST_DATE)).toBe(
            "Tuesday, June 11"
        );
    });

    it("give the current time", () => {
        expect(new DateTimeFormatter().formatTime(TEST_DATE)).toBe("2:30 pm");
    });
});
