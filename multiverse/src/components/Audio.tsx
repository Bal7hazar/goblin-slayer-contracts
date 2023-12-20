import { useRef, useState } from "react";

export const Audio = () => {
    const [music, setMusic] = useState(
        "https://replicate.delivery/pbxt/eCSi52ISai1YVyN6jqrNjfNuAMhBEHzGaPPFpYOKUg3UbDDSA/out.wav"
    );
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    return (
        <audio
            ref={audioRef}
            preload="metadata"
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            loop
        >
            <source type="audio/mpeg" src={music} />
        </audio>
    );
};
