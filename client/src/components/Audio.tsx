import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

interface TProps {
    playing: boolean;
    toggleMusic: () => void;
}

const Audio = (props: TProps) => {
    const { playing, toggleMusic } = props;

    return (
        <div className="h-4 w-4 flex justify-center items-center">
            <FontAwesomeIcon
                icon={playing ? faVolumeHigh : faVolumeMute}
                onClick={toggleMusic}
            />
        </div>
    );
};

export default Audio;
