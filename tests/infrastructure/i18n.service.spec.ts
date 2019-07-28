import I18nService from "../../src/infrastructure/i18n.service";
import TranslatorService from "../../src/domain/interfaces/translator.service";

describe("I18nService", () => {
    let service: TranslatorService;

    beforeEach(() => {
        service = new I18nService();
    })

    it("should translate a text in English", async () => {
        await service.init("en", "tests/infrastructure/locales");
        expect(service.getTranslation("key")).toBe("value");
    });

    it("should translate a text with parameters", async () => {
        await service.init("en", "tests/infrastructure/locales");
        expect(service.getTranslation("complexSentence", {
            arg1: "tic",
            arg2: "tac"
        })).toBe("My sentence with parameters: tic and tac.");
    })

    it("should translate a text in another language", async () =>{
        await service.init("fr", "tests/infrastructure/locales");
        expect(service.getTranslation("key")).toBe("valeur");
    })
});
