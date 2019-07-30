import SpeakerService from "../domain/interfaces/speaker.service";
const say = require("say");

export default class SayService implements SpeakerService {
    public say(text: string) {
        say.speak(text, "Victoria", 1.3);
    }
}
