import { forwardRef } from "react";
import gold from "/src/assets/gold-64.png";
import xp from "/src/assets/xp-64.png";
import bonus from "/src/assets/bonus-64.png";
import avatar from "/src/assets/avatar.png";
import fight from "/src/assets/duel-256.png";
import trophee from "/src/assets/trophee-256.png";
import shop from "/src/assets/shop-256.png";

interface TProps {
    slayerName: string;
    title: string;
    tag: string;
    slayer: any;
    handleDuelModal: () => void;
    handleShopModal: () => void;
}

const GameHeader = forwardRef((props: TProps, ref: any) => {
    const { slayerName, title, tag, slayer, handleDuelModal, handleShopModal } =
        props;
    return (
        <div
            className="flex justify-start"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col justify-center items-center py-1 ml-1 bg-slate-700 h-44 w-32 rounded-b-3xl">
                <p className="uppercase text-3xl">{slayerName}</p>
                <div className="rounded-full overflow-clip m-2 border-4 border-black bg-white">
                    <img
                        className="w-full h-full object-cover"
                        src={avatar}
                        alt=""
                    />
                </div>
                <div className="flex justify-center items-center">
                    <div className="rounded-full overflow-clip h-8 cursor-pointer hover:scale-110 transition-transform duration-300">
                        <img
                            className="w-full h-full object-cover"
                            src={fight}
                            alt=""
                            onClick={handleDuelModal}
                        />
                    </div>
                    <div className="rounded-full overflow-clip h-8 cursor-pointer hover:scale-110 transition-transform duration-300">
                        <img
                            className="w-full h-full object-cover"
                            src={trophee}
                            alt=""
                        />
                    </div>
                    <div className="rounded-full overflow-clip h-8 cursor-pointer hover:scale-110 transition-transform duration-300">
                        <img
                            className="w-full h-full object-cover"
                            src={shop}
                            alt=""
                            onClick={handleShopModal}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-start items-start">
                <div className="flex flex-col justify-center items-center h-20 w-32 bg-slate-600 rounded-br-3xl">
                    <p>{title} Slayer</p>
                    <div className="flex items-center px-2 my-2 border-black border-solid border rounded-xl bg-slate-800 text-slate-200">
                        <p className="text-sm text-center">{tag}</p>
                    </div>
                </div>
            </div>
            <div className="grow text-4xl text-center py-10 font-press-start uppercase">
                <h1 className="hidden md:block">Slayer</h1>
            </div>
            <div className="flex flex-col justify-start items-end gap-2 my-2">
                <div className="flex justify-between items-center h-10 w-32 md:w-64 bg-white bg-opacity-20 rounded-3xl pr-3">
                    <img
                        className="border border-black rounded-full w-10 h-10 object-cover"
                        src={xp}
                        alt=""
                    />
                    <div className="flex justify-center items-center">
                        <p className="text-3xl">{slayer?.xp.toString()}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center h-10 w-32 md:w-64 bg-white bg-opacity-20 rounded-3xl pr-3">
                    <img
                        className="border border-black rounded-full w-10 h-10 object-cover"
                        src={gold}
                        alt=""
                    />
                    <div className="flex justify-center items-center">
                        <p className="text-3xl">{slayer?.gold.toString()}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center h-10 w-32 md:w-64 bg-white bg-opacity-20 rounded-3xl pr-3">
                    <img
                        className="border border-black rounded-full w-10 h-10 object-cover"
                        src={bonus}
                        alt=""
                    />
                    <div className="flex justify-center items-center">
                        <p className="text-3xl">{slayer?.items.toString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GameHeader;
