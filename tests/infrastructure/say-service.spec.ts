import SayService from "../../src/infrastructure/say.service";
const say = require("say");

describe("SayService", () => {
    it("should say a text using say.js and select the locale", () => {
        const mockedSayCall = jest.spyOn(say, "speak").mockImplementation();

        const sayService = new SayService();
        sayService.say("Hello", "en");
        expect(mockedSayCall).toHaveBeenCalledWith("Hello", "Victoria", 1.3);

        sayService.say("Hello", "fr");
        expect(mockedSayCall).toHaveBeenCalledWith("Hello", "Amelie");

        sayService.say("Hello", "default");
        expect(mockedSayCall).toHaveBeenCalledWith("Hello", "Victoria", 1.3);
    });
});
