import SpeakerService from "../domain/interfaces/speaker.service";
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const player = require("play-sound")();

export default class GoogleTtsService implements SpeakerService {
    OUTPUT_FOLDER = "output";
    OUTPUT_FILE_NAME = "recap.mp3";

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
        if (!fs.existsSync(this.OUTPUT_FOLDER)){
            fs.mkdirSync(this.OUTPUT_FOLDER);
        }
        const OUTPUT_FILE_PATH = `${this.OUTPUT_FOLDER}/${this.OUTPUT_FILE_NAME}`;
        fs.writeFileSync(OUTPUT_FILE_PATH, response.audioContent, {encoding: "binary"});
        player.play(OUTPUT_FILE_PATH);
    }

    getClient() {
        return new textToSpeech.TextToSpeechClient();
    }
}
