import React, { useState, useEffect } from "react";
import { displayAddress, useDojo } from "../DojoContext";
import Audio from "./Audio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
// import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface TProps {
    name: string;
    playing: boolean;
    toggleMusic: () => void;
    handleName: (name: string) => void;
}

export const WalletScreen = (props: TProps) => {
    const { name, playing, toggleMusic, handleName } = props;
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(name);
    }, [name]);

    const {
        account: { create, account, clear },
    } = useDojo();

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleRefresh = async () => {
        if (!value) return;
        clear();
        await create();
        handleName(value);
    };

    return (
        <div className="px-8 md:px-20 py-2 bg-slate-800 flex justify-between items-center gap-4">
            <div className="grow hidden md:block" />
            <div className="flex gap-2 items-center h-8">
                <div>
                    <p>{displayAddress(account.address)}</p>
                </div>
                <input
                    className="border-black border-solid border rounded p-1 px-4 bg-slate-100 text-black h-8 w-20 md:w-32 uppercase"
                    placeholder="Name"
                    maxLength={9}
                    value={value}
                    onChange={handleValueChange}
                />
                <FontAwesomeIcon
                    icon={faArrowsRotate}
                    onClick={handleRefresh}
                    style={{
                        color: name ? "inherit" : "gray",
                        cursor: name ? "pointer" : "not-allowed",
                    }}
                />
                {/* <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={clear}
                    style={{
                        cursor: 'pointer',
                    }}
                /> */}
            </div>
            <Audio playing={playing} toggleMusic={toggleMusic} />
        </div>
    );
};
