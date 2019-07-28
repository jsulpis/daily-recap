import TranslatorService from "../domain/interfaces/translator.service";
const i18n = require("i18n");

export default class I18nService implements TranslatorService {
    init(locale: string, directory: string) {
        i18n.configure({ directory: directory });
        i18n.setLocale(locale);
    }

    setLocale(locale: string) {
        i18n.setLocale(locale);
    }

    getTranslation(key: string, payload?: Object): string {
        return !!payload ? i18n.__(key, payload) : i18n.__(key);
    }
}
