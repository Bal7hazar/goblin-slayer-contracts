import React from 'react';
import Action from './Action';

interface ActionsProps {
    slayer: any;
    duel: any;
    handleCreate: () => void;
    handleRoll: () => void;
    handleApply: () => void;
    handleSeek: () => void;
    handleBuy: () => void;
}

const Actions: React.FC<ActionsProps> = ({
    slayer,
    duel,
    handleCreate,
    handleRoll,
    handleApply,
    handleSeek,
    handleBuy
}) => {
    let actionsContent;

    console.log(duel);

    if (!slayer) {
        return (
            <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
                <div className="flex flex-col justify-center w-1/2 p-1">
                    <p>Create a new slayer to start!</p>
                </div>
                <div className="flex w-1/2">
                    <Action onClick={handleCreate}>Create</Action>
                </div>
            </div>
        );
    }

    if (slayer && duel ? duel.over : true) {
        return (
            <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
                <div className="flex flex-col justify-center w-1/2 p-1">
                    <p>What will Slayer do?</p>
                </div>
                <div className="flex w-1/2">
                    <Action onClick={handleSeek}>Seek</Action>
                    <Action onClick={handleBuy}>Buy</Action>
                </div>
            </div>
        );
    }

    if (duel.slayer_dices == 0) {
        return (
            <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
                <div className="flex flex-col justify-center w-1/2 p-1">
                    <p>Round {duel.round} / {duel.round_count}</p>
                </div>
                <div className="flex w-1/2">
                    <Action onClick={handleRoll}>Start</Action>
                    <Action onClick={handleApply}>Item</Action>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1">
            <div className="flex flex-col justify-center w-1/2 p-1">
                <p>Round {duel.round} / {duel.round_count}</p>
            </div>
            <div className="flex w-1/2">
                <Action onClick={handleRoll}>Roll</Action>
                <Action onClick={handleApply}>Item</Action>
            </div>
        </div>
    );
}

export default Actions;
