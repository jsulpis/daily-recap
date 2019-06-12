import MomentDateAgent from "../../src/infrastructure/moment-date-agent";

describe("MomentDateAgent", () => {
  it("gives a date properly formatted", () => {
    const DATE_TEST = new Date("2019-06-02");
    Date.now = jest.fn(() => DATE_TEST.getTime());

    expect(new MomentDateAgent().getCurrentDateInSpokenLanguage()).toBe("Sunday, June 2, 2019");
  });
});
