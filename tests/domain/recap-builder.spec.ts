import RecapBuilder from "../../src/domain/recap-builder";

describe("RecapBuilder", () => {
  it("can set the name", () => {
    expect(new RecapBuilder(null).setName("World").build()).toBe(
      "Hello World."
    );
    expect(new RecapBuilder(null).setName("Julien").build()).toBe(
      "Hello Julien."
    );
  });

  it("can set the date", () => {
    const mockDateAgent = {
      getCurrentDateInSpokenLanguage: () => "Sunday, June 2, 2019"
    };

    expect(new RecapBuilder(mockDateAgent).printCurrentDate().build()).toBe(
      "Today is Sunday, June 2, 2019."
    );
  });
});
