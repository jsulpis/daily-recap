export default interface TranslatorService {
    init(locale: string, directory: string);
    getTranslation(key: string, payload?: Object): string;
}
