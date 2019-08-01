import GoogleTtsService from "../../src/infrastructure/google-tts.service";
const fs = require("fs");

describe("GoogleTtsService", () => {
    it("should call the API and write an mp3 file", async () => {
        // Given
        const service = new GoogleTtsService();
        service.OUTPUT_FOLDER = "testfolder";
        service.OUTPUT_FILE_NAME = "hello.mp3";

        const mockSpeechSynthese = jest.fn(() =>
            Promise.resolve([{ audioContent: null }])
        );
        service.getClient = jest
            .fn(() => ({ synthesizeSpeech: mockSpeechSynthese }))
            .bind(service);

        const mockFsWrite = jest
            .spyOn(fs, "writeFileSync")
            .mockImplementation();
        const mockFsMkdir = jest.spyOn(fs, "mkdirSync").mockImplementation();

        // When
        const TEXT = "Hello";
        await service.say(TEXT, "en");

        // Then
        const EXPECTED_REQUEST = {
            input: { text: TEXT },
            voice: { languageCode: "en", ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" }
        };
        expect(mockSpeechSynthese).toHaveBeenCalledTimes(1);
        expect(mockSpeechSynthese).toHaveBeenCalledWith(EXPECTED_REQUEST);
        expect(mockFsWrite).toHaveBeenCalledTimes(1);
        expect(mockFsMkdir).toHaveBeenCalledTimes(1);
    });
});
