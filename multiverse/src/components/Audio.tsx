import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

// Audio

import music from "../audio/chill.mp3";

// interface TProps {
//     music: string;
// }

const Audio = () => {
    // const { music } = props;
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<any>(null);

    const toggleMusic = () => {
        if (audioRef.current && !isPlaying) {
            audioRef.current.play();
            setIsPlaying(true);
        } else if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="h-4 w-4 flex justify-center items-center">
            <FontAwesomeIcon
                icon={isPlaying ? faVolumeHigh : faVolumeMute}
                onClick={toggleMusic}
            />
            <audio ref={audioRef} preload="metadata" loop>
                <source type="audio/mpeg" src={music} />
            </audio>
        </div>
    );
};

export default Audio;
