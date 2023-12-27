import React from "react";
import Action from "./Action";
import background from "../assets/shop.svg";
import gold from "../assets/gold-64.png";

const ROUND_NAME = "Bonus";
const ROUND_PRICE = 10;

interface ShopModalProps {
    disabled: boolean;
    handleBuy: () => void;
}

const DuelModal: React.FC<ShopModalProps> = (props: ShopModalProps) => {
    const { disabled, handleBuy } = props;

    return (
        <div className="flex flex-col justify-center items-center m-auto z-0">
            <div
                className="relative max-w-xl flex flex-col gap-2 rounded-xl bg-slate-100 text-slate-900 overflow-clip w-80 h-96"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={background}
                    className="absolute top-0 w-full h-full object-cover z-0"
                    alt=""
                />
                <div className="grow" />
                <div className="flex justify-between border-black border-solid border-2 rounded p-1 bg-slate-200 m-1 z-10">
                    <div className="flex flex-col justify-center w-1/2 p-1">
                        <p>What does slayer want?</p>
                    </div>
                    <div className="flex w-1/2 justify-around">
                        <Action onClick={handleBuy} disabled={disabled}>
                            <div className="flex items-center gap-1">
                                {ROUND_NAME} ( {ROUND_PRICE}
                                <img src={gold} className="h-2" alt="gold" />)
                            </div>
                        </Action>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuelModal;
