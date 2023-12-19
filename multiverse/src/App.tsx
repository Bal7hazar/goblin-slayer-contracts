import { useEffect, useRef, useState } from "react";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import AnimatedNumbers from "react-animated-numbers";
import "./App.css";
import { client } from "./server";
import { useDojo } from "./DojoContext";
import Actions from './components/Actions';
import Dices from './components/Dices';

function App() {
    // States

    const [image, setImage] = useState("");
    const [portrait, setPortrait] = useState("");
    const [orders, setOrders] = useState(0x0);
    const [music, setMusic] = useState(
        "https://replicate.delivery/pbxt/eCSi52ISai1YVyN6jqrNjfNuAMhBEHzGaPPFpYOKUg3UbDDSA/out.wav"
    );
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const input = async () => {
            const background = await client.world.image.query({
                name: "single realistic balrog",
            });

            const portrait = await client.world.image.query({
                name: "the eldritch knight as a realistic fantasy knight, closeup portrait art by donato giancola and greg rutkowski, digital art, trending on artstation, symmetry! !",
            });

            // const music = await client.hello.music.query({
            //   name: "dark melancholy vibes, pads and synths, deep tribal drum, slow paced ",
            // });

            // console.log(music);

            // setMusic(music);

            setImage(background[0]);
            setPortrait(portrait[0]);
        };

        input();
        // audioRef.current?.play();
    }, []);

    // useEffect(() => {
    //     audioRef.current?.play();
    // }, [music]);

    // Dojo

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
    }

    const handleSeek = async () => {
        await provider.play.seek({
            account,
        });
    }

    const handleRoll = async () => {
        await provider.play.roll({
            account,
            orders: orders,
        });
        setOrders(0x0);
    }

    const handleBuy = async () => {
        await provider.play.buy({
            account,
            item: 0,
        });
    }

    const handleApply = async () => {
        await provider.play.apply({
            account,
            item: 0,
        });
    }

    // Helpers

    const updateOrders = (index: number, rolling: boolean) => {
        console.log(index, rolling);
        setOrders(orders => rolling ? orders | (1 << index) : orders & ~(1 << index));
    };

    return (
        <>
            <audio
                ref={audioRef}
                preload="metadata"
                onPlaying={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                loop
            >
                <source type="audio/mpeg" src={music} />
            </audio>
            {!image ? (
                <h1 className="text-4xl text-center py-10 font-press-start uppercase m-auto">Loading...</h1>
            ) : (
                <div className="h-screen p-2">
                    <h1 className="text-4xl text-center py-10 font-press-start uppercase">Slayer</h1>
                    <div className="max-w-xl relative flex flex-col gap-2 p-2 rounded m-auto bg-slate-100 text-slate-900">
                        <div className="flex justify-between gap-1">
                            <div className="flex flex-col items-start grow px-2">
                                <div className="flex justify-left items-center gap-4">
                                    <h2 className="text-2xl text-center uppercase">Goblin</h2>
                                    <div className="flex items-center px-2 my-2 border-black border-solid border rounded-xl bg-slate-800 text-slate-200">
                                        <h3 className="text-sm text-center">Shaman</h3>
                                    </div>
                                    <AnimatedNumbers
                                        className="text-center uppercase"
                                        animateToNumber={25}
                                        fontStyle={{
                                            fontSize: '1.5rem',
                                        }}
                                    />
                                </div>
                                <Dices dices={BigInt(0x0000000605040302)} disabled={true} />
                            </div>
                            <div className="rounded-3xl w-32 h-32 overflow-clip">
                                <img className="" src={image} alt="" />
                            </div>
                        </div>
                        <div className="flex justify-between gap-1">
                            <div className="rounded-3xl w-32 h-32 overflow-clip">
                                <img src={portrait} alt="" />
                            </div>
                            <div className="flex flex-col justify-end items-end grow px-2">
                                <div className="flex justify-right items-center gap-4">
                                    <AnimatedNumbers
                                        className="text-center uppercase"
                                        animateToNumber={37}
                                        fontStyle={{
                                            fontSize: '1.5rem',
                                        }}
                                    />
                                    <div className="flex items-center px-2 my-2 border-black border-solid border rounded-xl bg-slate-800 text-slate-200">
                                        <h3 className="text-sm text-center">Silver</h3>
                                    </div>
                                    <h2 className="text-2xl text-center uppercase">Slayer</h2>
                                </div>
                                <Dices dices={BigInt(0x00000000102030405)} disabled={false} updateOrders={updateOrders} />
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

                </div>
            )}
        </>
    );
}

export default App;
