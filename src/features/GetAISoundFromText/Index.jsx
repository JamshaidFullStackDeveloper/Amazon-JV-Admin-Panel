import { useState } from "react";
// import { getAITextToSpeech } from "./getAITextToSpeech";
import { Button } from "@/components/ui/button";
import { playTextToSpeech } from "./GetAIText";

const TextToSpeechPlayer = ({ text }) => {
    const [audioUrl, setAudioUrl] = useState(null);

    const handlePlay = async () => {
        const url = await playTextToSpeech(text);
        if (url) {
            setAudioUrl(url);
            const audio = new Audio(url);
            audio.play();
        }
    };

    return (
        <div className="flex items-center gap-4">
            <Button onClick={handlePlay} className="bg-blue-600 text-white">
                🔊 Play AI Voice
            </Button>
        </div>
    );
};

export default TextToSpeechPlayer;
