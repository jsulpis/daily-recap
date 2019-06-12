import Dummy from "../src/dummy";

describe("Dummy", function() {
  it("has a correct message", function() {
    expect(new Dummy().message).toBe("Hello");
  });
});
