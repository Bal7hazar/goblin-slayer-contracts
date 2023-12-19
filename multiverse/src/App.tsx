import { useEffect, useRef, useState } from "react";
import "./App.css";
import { client } from "./server";
import { useDojo } from "./DojoContext";

function App() {
    const [image, setImage] = useState("");
    const [portrait, setPortrait] = useState("");
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

    const {
        setup: {
            network: { provider },
            account: { account },
        },
    } = useDojo();

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
                <h1 className="text-4xl text-center">Loading...</h1>
            ) : (
                <div className="relative">
                    <img
                        className="w-screen h-screen object-cover"
                        src={image}
                        alt=""
                    />

                    <div className="w-full bg-white h-48 absolute bottom-0 left-0 flex justify-center">
                        <img className="w-48 h-48 " src={portrait} alt="" />
                        <button
                            onClick={async () =>
                                await provider.play.create({
                                    account,
                                    name: "ohayo",
                                })
                            }
                        >
                            Create
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
