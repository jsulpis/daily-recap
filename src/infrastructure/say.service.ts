import SpeakerService from "../domain/interfaces/speaker.service";
const say = require("say");

export default class SayService implements SpeakerService {
    say(text: string) {
        say.speak(text, "Victoria", 1.3);
    }
}
