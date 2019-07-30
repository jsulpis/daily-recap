import TranslatorService from "../domain/interfaces/translator.service";
const i18n = require("i18n");

export default class I18nService implements TranslatorService {
    public init(locale: string, directory: string) {
        i18n.configure({ directory });
        i18n.setLocale(locale);
    }

    public setLocale(locale: string) {
        i18n.setLocale(locale);
    }

    public getTranslation(key: string, payload?: object): string {
        return !!payload ? i18n.__(key, payload) : i18n.__(key);
    }
}
