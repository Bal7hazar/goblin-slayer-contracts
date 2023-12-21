import { useEffect, useState } from "react";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
// import AnimatedNumbers from "react-animated-numbers";
import { shortString } from "starknet";
import "./App.css";
// import { client } from "./server";
import { useDojo } from "./DojoContext";
import DuelModal from "./components/DuelModal";
import { useTerraformer } from "./hooks/useTerraformer";
import GameHeader from "./components/GameHeader";
import GameScene from "./components/GameScene";
import Loader from "./components/Loader";

// Images

import mainRules from "./assets/main-rules.png";
import duelRules from "./assets/duel-rules.png";

import { getRank, getTag, getTitle } from "./hooks/utils";
import { WalletScreen } from "./components/WalletScreen";

function App() {
    // States

    const { image, background, portrait } = useTerraformer();

    const [orders, setOrders] = useState(0x1f);
    const [tag, setTag] = useState("Starter");
    const [rank, setRank] = useState("Normal");
    const [title, setTitle] = useState("Slayer");
    const [goblin, setGoblin] = useState("Goblin");
    const [goblinDices, setGoblinDices] = useState(0);
    const [goblinScore, setGoblinScore] = useState(0);
    const [goblinCategory, setGoblinCategory] = useState(0);
    const [slayerName, setSlayerName] = useState("Anonymous");
    const [slayerDices, setSlayerDices] = useState(0);
    const [slayerScore, setSlayerScore] = useState(0);
    const [slayerCategory, setSlayerCategory] = useState(0);
    const [stopRoll, setStopRoll] = useState(false);
    const [duelModal, setDuelModal] = useState(true);

    const {
        setup: {
            components: { Duel, Slayer },
            network: { provider },
            // account: { create, list, select, account, isDeploying, clear },
            masterAccount: account,
        },
    } = useDojo();

    const slayerId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
    const slayer = useComponentValue(Slayer, slayerId);

    const duelId = getEntityIdFromKeys([
        BigInt(slayer ? slayer.duel_id : 0),
        BigInt(account.address),
    ]) as Entity;
    const duel = useComponentValue(Duel, duelId);

    // Effects

    useEffect(() => {
        if (slayer) {
            setTag(getTag(slayer.tag));
            setTitle(getTitle(slayer.title));
            setSlayerName(
                shortString.decodeShortString(slayer.name.toString())
            );
        }
        if (duel) {
            setRank(getRank(duel.rank));
            setGoblinDices(duel.goblin_dices);
            setGoblinScore(duel.goblin_score_value);
            setGoblinCategory(duel.goblin_score_category);
            setSlayerDices(duel.slayer_dices);
            setSlayerScore(duel.slayer_score_value);
            setSlayerCategory(duel.slayer_score_category);
        }
        setStopRoll(!stopRoll);
    }, [slayer, duel]);

    // Handlers

    const handleDuelModal = async () => {
        setDuelModal(!duelModal);
    };

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
        const new_orders = rolling
            ? orders | (1 << index)
            : orders & ~(1 << index);
        setOrders(new_orders);
    };

    return (
        <div className="relative">
            <div className="z-0">
                {!background ? (
                    <Loader />
                ) : (
                    <div className="h-screen z-0 flex flex-col">
                        <WalletScreen />
                        <div className="flex flex-col px-2 md:px-20 grow">
                            <GameHeader
                                slayerName={slayerName}
                                title={title}
                                tag={tag}
                                slayer={slayer}
                                handleDuelModal={handleDuelModal}
                            />
                            <div className="relative mt-10 h-1/2 flex-col justify-center items-center grow">
                                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/4 hidden md:block">
                                    <img
                                        className="object-cover"
                                        src={mainRules}
                                        alt=""
                                    />
                                </div>
                                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/4 hidden md:block">
                                    <img
                                        className="object-cover"
                                        src={duelRules}
                                        alt=""
                                    />
                                </div>
                                <GameScene />
                                {duelModal && (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full bg-gray-900/80">
                                        <DuelModal
                                            background={background}
                                            goblin={goblin}
                                            goblinCategory={goblinCategory}
                                            rank={rank}
                                            goblinScore={goblinScore}
                                            goblinDices={goblinDices}
                                            image={image}
                                            portrait={portrait}
                                            slayerName={slayerName}
                                            tag={tag}
                                            slayerScore={slayerScore}
                                            slayerDices={slayerDices}
                                            slayerCategory={slayerCategory}
                                            slayer={slayer}
                                            duel={duel}
                                            stopRoll={stopRoll}
                                            handleCreate={handleCreate}
                                            handleRoll={handleRoll}
                                            handleSeek={handleSeek}
                                            handleApply={handleApply}
                                            handleBuy={handleBuy}
                                            updateOrders={updateOrders}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <footer className="h-24">

                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
