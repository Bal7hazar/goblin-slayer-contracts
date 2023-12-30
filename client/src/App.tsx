import { useEffect, useState, useRef } from "react";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
// import AnimatedNumbers from "react-animated-numbers";
import { shortString } from "starknet";
import "./App.css";
// import { client } from "./server";
import { useDojo } from "./DojoContext";
import DuelModal from "./components/DuelModal";
import ShopModal from "./components/ShopModal";
import Leaderboard from "./components/Leaderboard";
// import { useTerraformer } from "./hooks/useTerraformer";
import GameHeader from "./components/GameHeader";
import GameScene from "./components/GameScene";

// Images

import mainRules from "./assets/main-rules.png";
import duelRules from "./assets/duel-rules.png";
import keyRules from "./assets/key-rules.png";
import actionRules from "./assets/action-rules.png";
import iconRules from "./assets/icon-rules.png";

import { getRank, getTag, getTitle } from "./hooks/utils";
import { WalletScreen } from "./components/WalletScreen";

import background from "./assets/duel-background.png";

function App() {
    // States

    // const { image, background, portrait } = useTerraformer();

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState(0x1f);
    const [tag, setTag] = useState("Starter");
    const [rank, setRank] = useState("Normal");
    const [title, setTitle] = useState("Slayer");
    const [goblin, setGoblin] = useState("Goblin");
    const [goblinDices, setGoblinDices] = useState(0);
    const [goblinCategory, setGoblinCategory] = useState(0);
    const [slayerName, setSlayerName] = useState("OHAYO");
    const [slayerDices, setSlayerDices] = useState(0);
    const [slayerCategory, setSlayerCategory] = useState(0);
    const [stopRoll, setStopRoll] = useState(false);
    const [duelModal, setDuelModal] = useState(false);
    const [shopModal, setShopModal] = useState(false);
    const [leaderboard, setLeaderboard] = useState(false);
    const [enableMove, setEnableMove] = useState(true);
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);
    const audioRef = useRef<any>(null);

    const {
        setup: {
            components: { Duel, Slayer },
            network: { provider },
            account: { account },
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
            setGoblinCategory(duel.goblin_score_category);
            setSlayerDices(duel.slayer_dices);
            setSlayerCategory(duel.slayer_score_category);
        }
        setStopRoll(!stopRoll);
    }, [slayer, duel]);

    useEffect(() => {
        handleCreate();
    }, [slayerName]);

    // Handlers

    const handleName = (name: string) => {
        setSlayerName(name.toUpperCase());
    }

    const handleCloseModals = async () => {
        setDuelModal(false);
        setShopModal(false);
        setLeaderboard(false);
        setEnableMove(true);
    };

    const handleDuelModal = async () => {
        // Close all openin modals
        setShopModal(false);
        setLeaderboard(false);
        // Toggle the modal
        setEnableMove(duelModal);
        setDuelModal(!duelModal);
    };

    const handleShopModal = async () => {
        // Close all openin modals
        setDuelModal(false);
        setLeaderboard(false);
        // Toggle the modal
        setEnableMove(shopModal);
        setShopModal(!shopModal);
    };

    const handleLeaderboard = async () => {
        // Close all openin modals
        setDuelModal(false);
        setShopModal(false);
        // Toggle the modal
        setEnableMove(leaderboard);
        setLeaderboard(!leaderboard);
    };

    const handleCreate = async () => {
        if (!isPlayingMusic) {
            toggleMusic();
        }
        setLoading(true);
        await provider.play.create({
            account,
            name: slayerName.toUpperCase(),
        });
        setLoading(false);
    };

    const handleSeek = async () => {
        if (duel ? duel.over : true) {
            await provider.play.seek({
                account,
            });
        }
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

    const toggleMusic = () => {
        if (audioRef.current && !isPlayingMusic) {
            audioRef.current.play();
            setIsPlayingMusic(true);
        } else if (isPlayingMusic) {
            audioRef.current.pause();
            setIsPlayingMusic(false);
        }
    };

    return (
        <div className="relative">
            <div className="z-0">
                <div className="h-screen z-0 flex flex-col">
                    <WalletScreen
                        name={slayerName}
                        audioRef={audioRef}
                        playing={isPlayingMusic}
                        toggleMusic={toggleMusic}
                        handleName={handleName}
                    />
                    <div
                        className="relative flex flex-col px-2 md:px-20 grow z-0"
                        onClick={handleCloseModals}
                    >
                        <GameHeader
                            slayerName={slayerName}
                            title={title}
                            tag={tag}
                            slayer={slayer}
                            handleDuelModal={handleDuelModal}
                            handleShopModal={handleShopModal}
                            handleLeaderboard={handleLeaderboard}
                        />
                        <div className="mt-10 h-1/2 flex-col justify-center items-center grow z-10">
                            <div className="absolute top-1/2 left-12 -translate-y-1/3 w-1/4 hidden md:block">
                                <img src={mainRules} alt="main-rules" />
                            </div>
                            <div className="absolute top-1/2 right-12 -translate-y-1/3 w-1/4 hidden md:block">
                                <img src={duelRules} alt="duel-rules" />
                            </div>
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 translate-y-1/6 w-1/3 hidden md:block">
                                <img src={keyRules} alt="keyboard-rules" />
                            </div>
                            <div className="absolute top-24 left-1/4 -translate-x-1/3 w-1/6 hidden md:block">
                                <img src={actionRules} alt="actions-rules" />
                            </div>
                            <div className="absolute top-24 right-1/4 translate-x-1/3 w-1/6 hidden md:block">
                                <img src={iconRules} alt="icon-rules" />
                            </div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
                                <GameScene
                                    enabled={enableMove}
                                    tag={slayer ? slayer.tag : 0}
                                    handleDuelModal={handleDuelModal}
                                    handleShopModal={handleShopModal}
                                    handleLeaderboard={handleLeaderboard}
                                    handleSeek={handleSeek}
                                />
                            </div>
                            {duelModal && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gray-900/80 flex justify-center items-center">
                                    <DuelModal
                                        background={background}
                                        goblin={goblin}
                                        goblinCategory={goblinCategory}
                                        rank={rank}
                                        goblinDices={goblinDices}
                                        slayerName={slayerName}
                                        tag={tag}
                                        slayerDices={slayerDices}
                                        slayerCategory={slayerCategory}
                                        slayer={slayer}
                                        duel={duel}
                                        stopRoll={stopRoll}
                                        handleRoll={handleRoll}
                                        handleSeek={handleSeek}
                                        handleApply={handleApply}
                                        handleBuy={handleBuy}
                                        handleCloseModals={handleCloseModals}
                                        updateOrders={updateOrders}
                                    />
                                </div>
                            )}
                            {shopModal && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gray-900/80 flex justify-center items-center">
                                    <ShopModal
                                        handleBuy={handleBuy}
                                        disabled={
                                            (slayer
                                                ? slayer.gold < BigInt(10)
                                                : false) ||
                                            (duel ? !duel.over : false)
                                        }
                                    />
                                </div>
                            )}
                            {leaderboard && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gray-900/80 flex justify-center items-center">
                                    <Leaderboard slayer={slayer} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
