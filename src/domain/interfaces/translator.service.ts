export default interface TranslatorService {
    init(locale: string, directory: string);
    setLocale(locale: string);
    getTranslation(key: string, payload?: object): string;
}
