import SpeakerService from "../domain/interfaces/speaker.service";
const say = require("say");

export default class SayService implements SpeakerService {
    public say(text: string, locale: string) {
        switch (locale) {
            case "en":
                say.speak(text, "Victoria", 1.3);
                break;
            case "fr":
                say.speak(text, "Amelie");
                break;
            default:
                say.speak(text, "Victoria", 1.3);
        }
    }
}
