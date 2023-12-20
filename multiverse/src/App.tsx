import { useEffect, useRef, useState } from "react";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import AnimatedNumbers from "react-animated-numbers";
import { shortString } from 'starknet';
import "./App.css";
import { client } from "./server";
import { useDojo } from "./DojoContext";
import Actions from "./components/Actions";
import Dices from "./components/Dices";
import Score from "./components/Score";
import { useTerraformer } from "./hooks/useTerraformer";

function App() {
    // States

    const { image, background, portrait } = useTerraformer();

    const [orders, setOrders] = useState(0x1F);
    const [tag, setTag] = useState("Starter");
    const [rank, setRank] = useState("Normal");
    const [title, setTitle] = useState("Slayer");
    const [goblin, _setGoblin] = useState("Goblin");
    const [goblinDices, setGoblinDices] = useState(0);
    const [goblinScore, setGoblinScore] = useState(0);
    const [goblinCategory, setGoblinCategory] = useState(0);
    const [slayerName, setSlayerName] = useState("Slayer");
    const [slayerDices, setSlayerDices] = useState(0);
    const [slayerScore, setSlayerScore] = useState(0);
    const [slayerCategory, setSlayerCategory] = useState(0);
    const [stopRoll, setStopRoll] = useState(false);

    const {
        setup: {
            components: { Duel, Slayer },
            network: { provider },
            account: { account },
        },
    } = useDojo();

    const slayerId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
    const slayer = useComponentValue(Slayer, slayerId);

    const duelId = getEntityIdFromKeys([BigInt(slayer ? slayer.duel_id : 0), BigInt(account.address)]) as Entity;
    const duel = useComponentValue(Duel, duelId);

    // Effects

    useEffect(() => {
        if (slayer) {
            setTag(getTag(slayer.tag));
            setTitle(getTitle(slayer.title));
            setSlayerName(shortString.decodeShortString(slayer.name));
        }
        if (duel) {
            console.log(duel);
            setRank(getRank(duel.rank));
            setGoblinDices(duel.goblin_dices);
            setGoblinScore(duel.goblin_score_value);
            setGoblinCategory(duel.goblin_score_category);
            setSlayerDices(duel.slayer_dices);
            setSlayerScore(duel.slayer_score_value);
            setSlayerCategory(duel.slayer_score_category);
        }
        setStopRoll(!stopRoll)
    }, [slayer, duel]);

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
        const new_orders = rolling ? orders | (1 << index) : orders & ~(1 << index);
        setOrders(new_orders);
    };

    const getTag = (tag: number) => {
        switch (tag) {
            case 0:
                return "Starter";
            case 1:
                return "Porcelain";
            case 2:
                return "Obsidian";
            case 3:
                return "Steel";
            case 4:
                return "Sapphire";
            case 5:
                return "Emerald";
            case 6:
                return "Ruby";
            case 7:
                return "Bronze";
            case 8:
                return "Silver";
            case 9:
                return "Gold";
            case 10:
                return "Platinium";
            default:
                return "Unknown";
        }
    }

    const getTitle = (title: number) => {
        switch (title) {
            case 0:
                return "Frugal";
            case 1:
                return "Steady";
            case 2:
                return "Thriving";
            case 3:
                return "Flourishing";
            case 4:
                return "Prosperous";
            case 5:
                return "Affluent";
            case 6:
                return "Wealthy";
            case 7:
                return "Opulent";
            case 8:
                return "Luxurious";
            case 9:
                return "Regal";
            case 10:
                return "Sovereign";
            default:
                return "Frugal";
        }
    }

    const getRank = (rank: number) => {
        switch (rank) {
            case 0:
                return "Normal";
            case 1:
                return "Rider";
            case 2:
                return "Hobgoblin";
            case 3:
                return "Shaman";
            case 4:
                return "Champion";
            case 5:
                return "Lord";
            case 6:
                return "Paladin";
            default:
                return "Goblin";
        }
    }

    return (
        <div className="relative">
            {/* <img
                src={background}
                className="absolute top-0 w-full h-full z-0 object-cover"
                alt=""
            /> */}
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
                            <Score category={goblinCategory} />
                            <div className="max-w-xl relative flex flex-col gap-2 p-2 rounded bg-slate-100 text-slate-900">
                                <div className="flex justify-between gap-1">
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
                                            {/* <AnimatedNumbers
                                                className="text-center uppercase"
                                                animateToNumber={goblinScore}
                                                fontStyle={{
                                                    fontSize: "1.5rem",
                                                }}
                                            /> */}
                                            <p className="text-center uppercase text-xl">{goblinScore}</p>
                                        </div>
                                        <Dices
                                            dices={BigInt(goblinDices)}
                                            disabled={true}
                                            stopRoll={stopRoll}
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
                                        <Dices
                                            dices={BigInt(slayerDices)}
                                            disabled={false}
                                            updateOrders={updateOrders}
                                            stopRoll={stopRoll}
                                        />
                                        <div className="flex justify-right items-center gap-4">
                                            <p className="text-center uppercase text-xl">{slayerScore}</p>
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
                                    handleCreate={handleCreate}
                                    handleRoll={handleRoll}
                                    handleApply={handleApply}
                                    handleSeek={handleSeek}
                                    handleBuy={handleBuy}
                                />
                            </div>
                            <Score category={slayerCategory} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
