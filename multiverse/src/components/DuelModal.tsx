import React from "react";
import Actions from "./Actions";
import Dices from "./Dices";
import Score from "./Score";

interface DuelModalProps {
    background: string;
    goblin: string;
    goblinCategory: number;
    rank: string;
    goblinScore: number;
    goblinDices: number;
    image: string;
    portrait: string;
    slayerName: string;
    tag: string;
    slayerScore: number;
    slayerDices: number;
    slayerCategory: number;
    slayer: any;
    duel: any;
    stopRoll: boolean;
    handleCreate: () => void;
    handleRoll: () => void;
    handleSeek: () => void;
    handleApply: () => void;
    handleBuy: () => void;
    updateOrders: (index: number, rolling: boolean) => void;
}

const DuelModal: React.FC<DuelModalProps> = (props: DuelModalProps) => {
    const {
        background,
        goblin,
        goblinCategory,
        rank,
        goblinScore,
        goblinDices,
        image,
        portrait,
        slayerName,
        tag,
        slayerScore,
        slayerDices,
        slayerCategory,
        slayer,
        duel,
        stopRoll,
        handleCreate,
        handleRoll,
        handleApply,
        handleSeek,
        handleBuy,
        updateOrders,
    } = props;

    return (
        <div className="flex flex-col justify-center items-center m-auto z-0">
            <Score category={goblinCategory} />
            <div className="relative max-w-xl flex flex-col gap-2 rounded bg-slate-100 text-slate-900 overflow-clip w-80 h-96">
                <img
                    src={background}
                    className="absolute top-0 w-full h-full object-cover opacity-50 z-0"
                    alt=""
                />
                <div className="z-10 max-w-xl flex flex-col gap-2 h-full">
                    <div className="flex justify-between gap-1 p-2">
                        <div className="flex flex-col justify-start items-start grow px-2">
                            <div className="flex justify-left items-center gap-4">
                                <h2 className="text-2xl text-center uppercase">
                                    {goblin}
                                </h2>
                                <div className="flex items-center px-2 my-2 border-black border-solid border rounded-xl bg-slate-800 text-slate-200">
                                    <h3 className="text-sm text-center">
                                        {rank}
                                    </h3>
                                </div>
                                <p className="text-center uppercase text-xl">
                                    {goblinScore}
                                </p>
                            </div>
                            <Dices
                                dices={BigInt(goblinDices)}
                                disabled={true}
                                stopRoll={stopRoll}
                            />
                        </div>
                        <div className="rounded-xl border-2 bg-white border-black max-w-20 h-20 overflow-clip">
                            <img
                                className="w-full h-full object-cover"
                                src={image}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="grow" />
                    <div className="flex justify-between gap-1 p-2">
                        <div className="rounded-xl border-2 bg-white border-black max-w-20 h-20 overflow-clip">
                            <img
                                className="w-full h-full object-cover"
                                src={portrait}
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col justify-end items-end grow px-2">
                            <Dices
                                dices={BigInt(slayerDices)}
                                disabled={false}
                                updateOrders={updateOrders}
                                stopRoll={stopRoll}
                            />
                            <div className="flex justify-right items-center gap-4">
                                <p className="text-center uppercase text-xl">
                                    {slayerScore}
                                </p>
                                <div className="flex items-center px-2 my-2 border-black border-solid border rounded-xl bg-slate-800 text-slate-200">
                                    <h3 className="text-sm text-center">
                                        {tag}
                                    </h3>
                                </div>
                                <h2 className="text-2xl text-center uppercase">
                                    {slayerName}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <Actions
                        slayer={slayer}
                        duel={duel}
                        handleCreate={handleCreate}
                        handleRoll={handleRoll}
                        handleApply={handleApply}
                        handleSeek={handleSeek}
                        handleBuy={handleBuy}
                    />
                </div>
            </div>
            <Score category={slayerCategory} />
        </div>
    );
};

export default DuelModal;
