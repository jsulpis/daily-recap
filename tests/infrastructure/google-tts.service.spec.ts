import GoogleTtsService from "../../src/infrastructure/google-tts.service";
const fs = require("fs");

describe("GoogleTtsService", () => {
    it("should call the API and write an mp3 file", async () => {
        // Given
        const service = new GoogleTtsService();

        const mockSpeechSynthese = jest.fn(() =>
            Promise.resolve([{ audioContent: null }])
        );
        service.getClient = jest
            .fn(() => ({ synthesizeSpeech: mockSpeechSynthese }))
            .bind(service);

        const mockFsCall = jest
            .spyOn(fs, "writeFileSync")
            .mockImplementation();

        // When
        const TEXT = "Hello";
        await service.say(TEXT);

        // Then
        const EXPECTED_REQUEST = {
            input: { text: TEXT },
            voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" }
        };
        expect(mockSpeechSynthese).toHaveBeenCalledTimes(1);
        expect(mockSpeechSynthese).toHaveBeenCalledWith(EXPECTED_REQUEST);
        expect(mockFsCall).toHaveBeenCalledTimes(1);
    });
});
