import SpeakerService from "../domain/interfaces/speaker.service";
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const player = require("play-sound")();

export default class GoogleTtsService implements SpeakerService {
    async say(text: string) {
        const client = this.getClient();
        const request = {
            input: { text: text },
            // Select the language and SSML Voice Gender (optional)
            voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" }
        };

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);

        // Write the binary audio content to a local file and play it
        fs.writeFileSync("output.mp3", response.audioContent, {encoding: "binary"});
        player.play("output.mp3");
    }

    getClient() {
        return new textToSpeech.TextToSpeechClient();
    }
}
