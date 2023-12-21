import { displayAddress, useDojo } from "../DojoContext";
import Action from "./Action";

export const WalletScreen = () => {
    const {
        setup: {
            account: { create, list, select, account, isDeploying },
        },
    } = useDojo();

    return (
        <div className="px-8 md:px-20 py-2 bg-slate-800 flex justify-between items-center gap-2">
            <div className="grow hidden md:block" />
            <div className="">
                Select Slayer
            </div>
            <div className="flex gap-2">
                <Action onClick={create}>
                    {isDeploying ? "Spawning..." : "Deploy"}
                </Action>
                <select
                    className="border-black border-solid border rounded p-1 px-4 bg-slate-100 text-black"
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
                </select>
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
