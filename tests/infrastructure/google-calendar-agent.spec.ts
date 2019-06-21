import GoogleCalendarAgent from "../../src/infrastructure/google-calendar-agent";
const fs = require("mz/fs");
const readline = require("readline");
const { google } = require("googleapis");

describe("GoogleCalendarAgent", () => {
  //const mockedCalendarCall = jest.spyOn(google, "calendar");
  //const mockedReadlineCall = jest.spyOn(google, "get");
  const mockedFsCall = jest.spyOn(fs, "readFile");

  const TOKEN_PATH = "static/token.json";
  const CREDENTIALS_PATH = "static/credentials.json";

  it("should return the list of the events of the day", async () => {
    let calendarAgent = new GoogleCalendarAgent();
    const getRawEvents = jest.fn(() => Promise.resolve([]));
    calendarAgent.getRawEvents = getRawEvents.bind(calendarAgent);

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

    expect(events).toBeDefined();
    expect(events).toHaveLength(0);
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
