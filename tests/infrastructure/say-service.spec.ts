import SayService from "../../src/infrastructure/say.service";
const say = require("say");

describe("SayService", () => {
    it("should say a text using say.js", () => {
        const mockedSayCall = jest.spyOn(say, "speak").mockImplementation();

        new SayService().say("Hello");
        expect(mockedSayCall).toHaveBeenCalledWith("Hello", "Victoria", 1.3);
    });
});
