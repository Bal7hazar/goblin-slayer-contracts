import React from 'react';
import Action from './Action';

interface ActionsProps {
    slayer?: any;
    handleCreate: () => void;
    handleRoll: () => void;
    handleApply: () => void;
    handleSeek: () => void;
    handleBuy: () => void;
}

const Actions: React.FC<ActionsProps> = ({
    slayer,
    handleCreate,
    handleRoll,
    handleApply,
    handleSeek,
    handleBuy
}) => {
    return (
        <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-300">
            <div className="flex flex-col w-1/2 p-1">
                <p>What will Slayer do?</p>
            </div>
            {!slayer ? (
                <Action onClick={handleCreate}>Create</Action>
            ) : (
                <div className="flex flex-wrap w-1/2">
                    <Action onClick={handleRoll}>Roll</Action>
                    <Action onClick={handleApply}>Item</Action>
                    <Action onClick={handleSeek}>Seek</Action>
                    <Action onClick={handleBuy}>Buy</Action>
                </div>
            )}
        </div>
    );
}

export default Actions;
