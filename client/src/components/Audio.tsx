import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

// Audio

import music from "../audio/chill.mp3";

interface TProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    playing: boolean;
    toggleMusic: () => void;
}

const Audio = (props: TProps) => {
    const { audioRef, playing, toggleMusic } = props;

    return (
        <div className="h-4 w-4 flex justify-center items-center">
            <FontAwesomeIcon
                icon={playing ? faVolumeHigh : faVolumeMute}
                onClick={toggleMusic}
            />
            <audio ref={audioRef} preload="metadata" loop>
                <source type="audio/mpeg" src={music} />
            </audio>
        </div>
    );
};

export default Audio;
