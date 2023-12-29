import React from "react";
import Action from "./Action";

interface ActionsProps {
    slayer: any;
    duel: any;
    handleCreate: () => void;
    handleRoll: () => void;
    handleApply: () => void;
    handleSeek: () => void;
    handleBuy: () => void;
    handleCloseModals: () => void;
}

const Actions: React.FC<ActionsProps> = ({
    slayer,
    duel,
    handleCreate,
    handleRoll,
    handleApply,
    handleSeek,
    handleBuy,
    handleCloseModals,
}) => {
    if (!slayer) {
        return (
            <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
                <div className="flex flex-col justify-center w-1/2 p-1">
                    <p>New slayer?</p>
                </div>
                <div className="flex w-1/2 justify-around">
                    <Action onClick={handleCreate}>Create</Action>
                </div>
            </div>
        );
    }

    if (slayer && duel ? duel.over : true) {
        return (
            <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
                <div className="flex flex-col justify-center w-1/2 p-1">
                    <p>{`You ${slayer.xp == 0 ? "lose" : "win"}!`}</p>
                </div>
                <div className="flex w-1/2 justify-around">
                    <Action onClick={handleCloseModals}>Close</Action>
                </div>
            </div>
        );
    }

    // if (slayer && duel ? duel.over : true) {
    //     return (
    //         <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
    //             <div className="flex flex-col justify-center w-1/2 p-1">
    //                 <p>What will Slayer do?</p>
    //             </div>
    //             <div className="flex w-1/2 justify-around">
    //                 <Action onClick={handleSeek}>Seek</Action>
    //             </div>
    //         </div>
    //     );
    // }

    const disabled = slayer.items == 0;

    if (duel.slayer_dices == 0) {
        return (
            <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
                <div className="flex flex-col justify-center w-1/2 p-1">
                    <p>
                        Round {duel.round} / {duel.round_count}
                    </p>
                </div>
                <div className="flex w-1/2 justify-around">
                    <Action onClick={handleRoll}>Start</Action>
                    <Action onClick={handleApply} disabled={disabled}>
                        Bonus
                    </Action>
                </div>
            </div>
        );
    }

    if (duel.round == duel.round_count) {
        return (
            <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
                <div className="flex flex-col justify-center w-1/2 p-1">
                    <p>
                        Round {duel.round} / {duel.round_count}
                    </p>
                </div>
                <div className="flex w-1/2 justify-around">
                    <Action onClick={handleRoll}>Finish</Action>
                    <Action onClick={handleApply} disabled={disabled}>
                        Bonus
                    </Action>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
            <div className="flex flex-col justify-center w-1/2 p-1">
                <p>
                    Round {duel.round} / {duel.round_count}
                </p>
            </div>
            <div className="flex w-1/2 justify-around gap-1">
                <Action onClick={handleRoll}>Roll</Action>
                <Action onClick={handleApply} disabled={disabled}>
                    Bonus
                </Action>
            </div>
        </div>
    );
};

export default Actions;
