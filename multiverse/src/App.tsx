import { useEffect, useRef, useState } from "react";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import AnimatedNumbers from "react-animated-numbers";
import "./App.css";
import { client } from "./server";
import { useDojo } from "./DojoContext";
import Actions from "./components/Actions";
import Dices from "./components/Dices";
import large from "./assets/large-straight.png";
import small from "./assets/small-straight.png";
import full from "./assets/full-house.png";
import pair from "./assets/pair.png";
import double from "./assets/double-pair.png";
import toak from "./assets/toak.png";
import foak from "./assets/foak.png";
import yahtzee from "./assets/yahtzee.png";
import chance from "./assets/chance.png";
import { useTerraformer } from "./hooks/useTerraformer";

function App() {
    // States

    const { image, background, portrait } = useTerraformer();

    const [orders, setOrders] = useState(0x0);
    const [tag, setTag] = useState("Silver");
    const [rank, setRank] = useState("Shaman");
    const [title, setTitle] = useState("Slayer");
    const [foe, setFoe] = useState("Goblin");
    const [foeScore, setFoeScore] = useState(37);
    const [slayerScore, setSlayerScore] = useState(25);

    const {
        setup: {
            components: { Duel, Slayer },
            network: { provider },
            account: { account },
        },
    } = useDojo();

    const slayerId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
    const slayer = useComponentValue(Slayer, slayerId);

    // Handlers

    const handleCreate = async () => {
        await provider.play.create({
            account,
            name: "ohayo",
        });
    };

    const handleSeek = async () => {
        await provider.play.seek({
            account,
        });
    };

    const handleRoll = async () => {
        await provider.play.roll({
            account,
            orders: orders,
        });
        setOrders(0x0);
    };

    const handleBuy = async () => {
        await provider.play.buy({
            account,
            item: 0,
        });
    };

    const handleApply = async () => {
        await provider.play.apply({
            account,
            item: 0,
        });
    };

    // Helpers

    const updateOrders = (index: number, rolling: boolean) => {
        console.log(index, rolling);
        setOrders((orders) =>
            rolling ? orders | (1 << index) : orders & ~(1 << index)
        );
    };

    return (
        <div className="relative">
            <img
                src={background}
                className="absolute top-0 w-full h-full z-0 object-cover"
                alt=""
            />
            <div className="z-10 ">
                {!image ? (
                    <h1 className="text-4xl text-center py-10 font-press-start uppercase m-auto">
                        Loading...
                    </h1>
                ) : (
                    <div className="h-screen p-2">
                        <h1 className="text-4xl text-center py-10 font-press-start uppercase">
                            Slayer
                        </h1>
                        <div className="flex flex-col justify-center items-center m-auto">
                            <div className="flex justify-start">
                                <img
                                    className="opacity-20"
                                    src={chance}
                                    alt="chance"
                                />
                                <img
                                    className="opacity-20"
                                    src={pair}
                                    alt="pair"
                                />
                                <img
                                    className="opacity-20"
                                    src={double}
                                    alt="double"
                                />
                                <img
                                    className="opacity-20"
                                    src={toak}
                                    alt="three of a kind"
                                />
                                <img
                                    className=""
                                    src={foak}
                                    alt="four of a kind"
                                />
                                <img
                                    className="opacity-20"
                                    src={full}
                                    alt="full-house"
                                />
                                <img
                                    className="opacity-20"
                                    src={small}
                                    alt="small"
                                />
                                <img
                                    className="opacity-20"
                                    src={large}
                                    alt="large"
                                />
                                <img
                                    className="opacity-20"
                                    src={yahtzee}
                                    alt="yahtzee"
                                />
                            </div>
                            <div className="max-w-xl relative flex flex-col gap-2 p-2 rounded bg-slate-100 text-slate-900">
                                <div className="flex justify-between gap-1">
                                    <div className="flex flex-col items-start grow px-2">
                                        <div className="flex justify-left items-center gap-4">
                                            <h2 className="text-2xl text-center uppercase">
                                                {foe}
                                            </h2>
                                            <div className="flex items-center px-2 my-2 border-black border-solid border rounded-xl bg-slate-800 text-slate-200">
                                                <h3 className="text-sm text-center">
                                                    {rank}
                                                </h3>
                                            </div>
                                            <AnimatedNumbers
                                                className="text-center uppercase"
                                                animateToNumber={foeScore}
                                                fontStyle={{
                                                    fontSize: "1.5rem",
                                                }}
                                            />
                                        </div>
                                        <Dices
                                            dices={BigInt(0x0000000605040302)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="rounded-3xl w-24 h-24 overflow-clip">
                                        <img className="" src={image} alt="" />
                                    </div>
                                </div>
                                <div className="flex justify-between gap-1">
                                    <div className="rounded-3xl w-24 h-24 overflow-clip">
                                        <img src={portrait} alt="" />
                                    </div>
                                    <div className="flex flex-col justify-end items-end grow px-2">
                                        <div className="flex justify-right items-center gap-4">
                                            <AnimatedNumbers
                                                className="text-center uppercase"
                                                animateToNumber={slayerScore}
                                                fontStyle={{
                                                    fontSize: "1.5rem",
                                                }}
                                            />
                                            <div className="flex items-center px-2 my-2 border-black border-solid border rounded-xl bg-slate-800 text-slate-200">
                                                <h3 className="text-sm text-center">
                                                    {tag}
                                                </h3>
                                            </div>
                                            <h2 className="text-2xl text-center uppercase">
                                                {title}
                                            </h2>
                                        </div>
                                        <Dices
                                            dices={BigInt(0x00000000102030405)}
                                            disabled={false}
                                            updateOrders={updateOrders}
                                        />
                                    </div>
                                </div>
                                <Actions
                                    slayer={slayer}
                                    handleCreate={handleCreate}
                                    handleRoll={handleRoll}
                                    handleApply={handleApply}
                                    handleSeek={handleSeek}
                                    handleBuy={handleBuy}
                                />
                            </div>
                            <div className="flex justify-start">
                                <img
                                    className="opacity-20"
                                    src={chance}
                                    alt="chance"
                                />
                                <img
                                    className="opacity-20"
                                    src={pair}
                                    alt="pair"
                                />
                                <img
                                    className="opacity-20"
                                    src={double}
                                    alt="double"
                                />
                                <img
                                    className="opacity-20"
                                    src={toak}
                                    alt="three of a kind"
                                />
                                <img
                                    className="opacity-20"
                                    src={foak}
                                    alt="four of a kind"
                                />
                                <img
                                    className="opacity-20"
                                    src={full}
                                    alt="full-house"
                                />
                                <img
                                    className="opacity-20"
                                    src={small}
                                    alt="small"
                                />
                                <img className="" src={large} alt="large" />
                                <img
                                    className="opacity-20"
                                    src={yahtzee}
                                    alt="yahtzee"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
