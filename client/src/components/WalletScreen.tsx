import { displayAddress, useDojo } from "../DojoContext";
import Action from "./Action";
import Audio from "./Audio";

interface TProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    playing: boolean;
    toggleMusic: () => void;
}

export const WalletScreen = (props: TProps) => {
    const { audioRef, playing, toggleMusic } = props;
    const {
        setup: {
            account: { create, list, select, account, isDeploying },
        },
    } = useDojo();

    return (
        <div className="px-8 md:px-20 py-2 bg-slate-800 flex justify-between items-center gap-2">
            <div className="grow hidden md:block" />
            <div className="flex gap-2 items-center h-8">
                {/* <Action onClick={create}>
                    {isDeploying ? "Spawning..." : "Deploy"}
                </Action>
                <input
                    className="border-black border-solid border rounded p-1 px-4 bg-slate-100 text-black h-8 w-20 md:w-32 uppercase"
                    placeholder="Name"
                    maxLength={9}
                />
                <select
                    className="border-black border-solid border rounded p-1 px-4 bg-slate-100 text-black h-8"
                    value={account ? account.address : ""}
                    onChange={(e) => select(e.target.value)}
                >
                    {list().map((account, index) => {
                        return (
                            <option value={account.address} key={index}>
                                {displayAddress(account.address)}
                            </option>
                        );
                    })}
                </select> */}
                <Audio
                    audioRef={audioRef}
                    playing={playing}
                    toggleMusic={toggleMusic}
                />
                {/* <div>
                        <button
                            className="border-black border-solid border rounded p-1 px-4"
                            onClick={() => clear()}
                        >
                            Clear
                        </button>
                    </div> */}
            </div>
        </div>
    );
};
