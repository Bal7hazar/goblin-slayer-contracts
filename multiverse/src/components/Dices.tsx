import React from 'react';
import Dice from "./Dice";
import { TValue } from './Dice/_types';

interface DicesProps {
    dices: bigint;
    disabled: boolean;
    stopRoll: boolean;
    updateOrders?: (index: number, rolling: boolean) => void;
}

const Dices: React.FC<DicesProps> = ({ dices, disabled, stopRoll, updateOrders }) => {
    const values: number[] = [];
    let remainingDices = dices;

    while (remainingDices > BigInt(0)) {
        const value = Number(remainingDices & BigInt(255));
        values.push(value);
        remainingDices >>= BigInt(8);
    }

    if (values.length === 0) return;
    return (
        <div className="flex justify-center gap-3 py-2">
            {values.map((value, i) => (
                <Dice
                    key={i}
                    index={i}
                    onRoll={updateOrders}
                    size={30}
                    defaultValue={value as TValue}
                    cheatValue={value as TValue}
                    disabled={disabled}
                    stopRoll={stopRoll}
                />
            ))}
        </div>
    );
};

export default Dices;
