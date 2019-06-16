import MomentDateAgent from "../../src/infrastructure/moment-date-agent";

describe("MomentDateAgent", () => {
  beforeAll(() => {
    const DATE_TEST = new Date("2019-06-11T14:30");
    Date.now = jest.fn(() => DATE_TEST.getTime());
  })

  it("gives a date properly formatted", () => {
    expect(new MomentDateAgent().getCurrentDate()).toBe("Tuesday, June 11");
  });

  it("give the current time", () => {
    expect(new MomentDateAgent().getCurrentTime()).toBe("2:30 pm")
  })
});
