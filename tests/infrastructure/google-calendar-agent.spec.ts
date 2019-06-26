import GoogleCalendarAgent from "../../src/infrastructure/google-calendar-agent";
import CalendarEvent from "../../src/domain/model/calendar-event";

const fs = require("mz/fs");
const readline = require("readline");

describe("GoogleCalendarAgent", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation();

  const mockedReadlineCall = jest.spyOn(readline, "createInterface");
  const mockedFsCall = jest.spyOn(fs, "readFile");

  const TOKEN_PATH = "static/token.json";
  const CREDENTIALS_PATH = "static/credentials.json";

  const MOCK_RAW_EVENTS = [
    {
      summary: "firstEvent",
      start: { dateTime: new Date("2019-06-26T10:30:00") }
    },
    {
      summary: "secondEvent",
      start: { dateTime: new Date("2019-06-26T10:30:00") }
    }
  ];
  const MOCK_CALENDAR_EVENTS = [
    new CalendarEvent("firstEvent", new Date("2019-06-26T10:30:00")),
    new CalendarEvent("secondEvent", new Date("2019-06-26T10:30:00"))
  ];
  const MOCK_AUTH = {
    setCredentials() {},
    generateAuthUrl() {},
    getToken() {
      return Promise.resolve(JSON.stringify(require("./mock-token.json")));
    }
  };

  let calendarAgent: GoogleCalendarAgent;

  beforeEach(() => {
    calendarAgent = new GoogleCalendarAgent();

    calendarAgent.getRawEvents = jest
      .fn(() => Promise.resolve(MOCK_RAW_EVENTS))
      .bind(calendarAgent);

    calendarAgent.createAuthClient = jest
      .fn(() => MOCK_AUTH)
      .bind(calendarAgent);

    // reset calls history
    mockedFsCall.mock.calls = [];
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("should return the list of the events of the day if credentials and token ok", async () => {
    mockedFsCall.mockImplementation(file => {
      let content = "";
      if (file === CREDENTIALS_PATH) {
        content = require("./mock-credentials.json");
      } else if (file === TOKEN_PATH) {
        content = require("./mock-token.json");
      }
      return Promise.resolve(JSON.stringify(content));
    });

    const events = await calendarAgent.getEventsOfTheDay();

    expect(events).toEqual(MOCK_CALENDAR_EVENTS);
    expect(mockedFsCall).toHaveBeenCalledTimes(2);
    expect(mockedFsCall).toHaveBeenCalledWith(CREDENTIALS_PATH);
    expect(mockedFsCall).toHaveBeenCalledWith(TOKEN_PATH);
  });

  it("should throw an error if no credentials found", done => {
    mockedFsCall.mockImplementation(file => {
      if (file === CREDENTIALS_PATH) {
        return Promise.reject("errorMsg");
      } else if (file === TOKEN_PATH) {
        return ""; // should not be called
      }
    });

    calendarAgent
      .getEventsOfTheDay()
      .then(() => fail("Promise should not resove"))
      .catch(err => {
        expect(err).toEqual(
          new Error("Error loading client secret file: errorMsg")
        );
        expect(mockedFsCall).toHaveBeenCalledTimes(1);
        expect(mockedFsCall).toHaveBeenCalledWith(CREDENTIALS_PATH);
        done();
      });
  });

  it("should ask for identification if no token found, then return the events", done => {
    mockedFsCall.mockImplementation(file => {
      if (file === CREDENTIALS_PATH) {
        return Promise.resolve(
          JSON.stringify(require("./mock-credentials.json"))
        );
      } else if (file === TOKEN_PATH) {
        return Promise.reject();
      }
    });
    const mockReadline = {
      question: jest.fn(MOCK_AUTH.getToken)
    };
    mockedReadlineCall.mockReturnValue(mockReadline);

    calendarAgent
      .getEventsOfTheDay()
      .catch(err => fail("Promise should not fail: " + err))
      .then(events => {
        expect(events).toEqual(MOCK_CALENDAR_EVENTS);
        expect(mockReadline.question).toHaveBeenCalledTimes(1);
        expect(mockedFsCall).toHaveBeenCalledTimes(2);
        expect(mockedFsCall).toHaveBeenCalledWith(CREDENTIALS_PATH);
        expect(mockedFsCall).toHaveBeenCalledWith(TOKEN_PATH);
        done();
      });
  });

  it("should return an event marked 'allDay' for events with date instead of dateTime", async () => {
    mockedFsCall.mockImplementation(file => {
      let content = "";
      if (file === CREDENTIALS_PATH) {
        content = require("./mock-credentials.json");
      } else if (file === TOKEN_PATH) {
        content = require("./mock-token.json");
      }
      return Promise.resolve(JSON.stringify(content));
    });

    calendarAgent.getRawEvents = jest
      .fn(() =>
        Promise.resolve([
          {
            summary: "firstEvent",
            start: { date: new Date("2019-06-26") }
          }
        ])
      )
      .bind(calendarAgent);

    const events = await calendarAgent.getEventsOfTheDay();

    expect(events).toEqual([
      new CalendarEvent("firstEvent", new Date("2019-06-26"), true)
    ]);
    expect(mockedFsCall).toHaveBeenCalledTimes(2);
    expect(mockedFsCall).toHaveBeenCalledWith(CREDENTIALS_PATH);
    expect(mockedFsCall).toHaveBeenCalledWith(TOKEN_PATH);
  });

  it("should find the start of the day as a Date", () => {
    const day = new Date("2019-06-22T18:45:00+00:00");
    const startOfDay = new Date("2019-06-22T00:00:00+00:00");
    expect(new GoogleCalendarAgent().startOfDay(day)).toEqual(startOfDay);
  });

  it("should find the end of the day as a Date", () => {
    const day = new Date("2019-06-22T18:45:00+00:00");
    const endOfNextDay = new Date("2019-06-22T23:59:59.999+00:00");
    expect(new GoogleCalendarAgent().endOfDay(day)).toEqual(endOfNextDay);
  });
});
