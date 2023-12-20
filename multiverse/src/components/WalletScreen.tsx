import { displayAddress, useDojo } from "../DojoContext";
import Action from "./Action";

export const WalletScreen = () => {
    const {
        setup: {
            account: { create, list, select, account, isDeploying },
        },
    } = useDojo();

    return (
        <div className="p-8">
            <h1 className="text-2xl">Select Slayer</h1>

            <div className="flex">
                <Action onClick={create}>
                    {isDeploying ? "spawning slayer" : "create slayer"}
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
