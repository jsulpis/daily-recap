import SpeakerService from "../domain/interfaces/speaker.service";
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const player = require("play-sound")();

export default class GoogleTtsService implements SpeakerService {
    public OUTPUT_FOLDER = "output";
    public OUTPUT_FILE_NAME = "recap.mp3";

    public async say(text: string) {
        const client = this.getClient();
        const request = {
            audioConfig: { audioEncoding: "MP3" },
            input: { text },
            // Select the language and SSML Voice Gender (optional)
            voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" }
        };

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);

        // Write the binary audio content to a local file and play it
        if (!fs.existsSync(this.OUTPUT_FOLDER)) {
            fs.mkdirSync(this.OUTPUT_FOLDER);
        }
        const OUTPUT_FILE_PATH = `${this.OUTPUT_FOLDER}/${this.OUTPUT_FILE_NAME}`;
        fs.writeFileSync(OUTPUT_FILE_PATH, response.audioContent, {
            encoding: "binary"
        });
        player.play(OUTPUT_FILE_PATH);
    }

    public getClient() {
        return new textToSpeech.TextToSpeechClient();
    }
}
