import React from "react";
import Actions from "./Actions";
import Dices from "./Dices";
import Score from "./Score";

// Images

import goblin0 from "../assets/goblin-0-avatar-256.png";
import goblin1 from "../assets/goblin-1-avatar-256.png";
import goblin2 from "../assets/goblin-2-avatar-256.png";
import goblin3 from "../assets/goblin-3-avatar-256.png";
import goblin4 from "../assets/goblin-4-avatar-256.png";
import goblin5 from "../assets/goblin-5-avatar-256.png";
import goblin6 from "../assets/goblin-6-avatar-256.png";

import slayer0 from "../assets/slayer-0-avatar-256.png";
import slayer1 from "../assets/slayer-1-avatar-256.png";
import slayer2 from "../assets/slayer-2-avatar-256.png";
import slayer3 from "../assets/slayer-3-avatar-256.png";
import slayer4 from "../assets/slayer-4-avatar-256.png";
import slayer5 from "../assets/slayer-5-avatar-256.png";
import slayer6 from "../assets/slayer-6-avatar-256.png";
import slayer7 from "../assets/slayer-7-avatar-256.png";
import slayer8 from "../assets/slayer-8-avatar-256.png";
import slayer9 from "../assets/slayer-9-avatar-256.png";
import slayer10 from "../assets/slayer-10-avatar-256.png";

interface DuelModalProps {
    background: string;
    goblin: string;
    goblinCategory: number;
    rank: string;
    goblinDices: number;
    slayerName: string;
    tag: string;
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

const GOLBINS = [
    goblin0,
    goblin1,
    goblin2,
    goblin3,
    goblin4,
    goblin5,
    goblin6,
];

const SLAYERS = [
    slayer0,
    slayer1,
    slayer2,
    slayer3,
    slayer4,
    slayer5,
    slayer6,
    slayer7,
    slayer8,
    slayer9,
    slayer10,
];

const DuelModal: React.FC<DuelModalProps> = (props: DuelModalProps) => {
    const {
        background,
        goblin,
        goblinCategory,
        rank,
        goblinDices,
        slayerName,
        tag,
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
            <div onClick={(e) => e.stopPropagation()}>
                <Score category={goblinCategory} />
                <div className="relative max-w-xl flex flex-col gap-2 rounded-xl bg-slate-100 text-slate-900 overflow-clip w-80 h-96">
                    <img
                        src={background}
                        className="absolute top-0 w-full h-full object-cover opacity-80 z-0"
                        alt=""
                    />
                    <div className="z-10 max-w-xl flex flex-col gap-2 h-full">
                        <div className="flex justify-between items-start gap-1 p-2">
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
                                </div>
                                <Dices
                                    dices={BigInt(goblinDices)}
                                    disabled={true}
                                    stopRoll={stopRoll}
                                />
                            </div>
                            <div className="w-20 h-20 overflow-clip flex justify-center items-center">
                                <img
                                    className="w-full h-full object-cover"
                                    src={duel ? GOLBINS[duel.rank] : GOLBINS[0]}
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="grow" />
                        <div className="flex justify-between items-end gap-1 p-2">
                            <div className="w-20 h-20 overflow-clip">
                                <img
                                    className="w-full h-full object-cover"
                                    src={slayer ? SLAYERS[slayer.tag] : SLAYERS[0]}
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
        </div>
    );
};

export default DuelModal;
