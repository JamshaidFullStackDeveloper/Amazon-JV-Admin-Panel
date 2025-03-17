export const playTextToSpeech = (text) => {
    if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";

        // Get available voices and select a female voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice =>
            voice.name.includes("Female") || voice.name.includes("Google US English")
        );

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        speechSynthesis.speak(utterance);
    } else {
        console.error("❌ Text-to-Speech not supported in this browser.");
    }
};
