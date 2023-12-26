import { useState, useEffect } from "react";
import Character from "./Character";

import mapData from "../assets/layers.json";
import TILESET_IMAGE from "../assets/tileset.png";

const TILE_SIZE = 16;
const TILESET_WIDTH_IN_TILES = 27;
const GROUND_LAYERS = ["Ground-1", "Ground-2", "Ground-3", "Ground-4"];
const SCALE_FACTOR = 1.5;

interface TProps {
    enabled: boolean;
    tag: number;
    handleShopModal: () => void;
}

const GameScene = (props: TProps) => {
    const { enabled, tag, handleShopModal } = props;
    const [currentGroundIndex, setCurrentGroundIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGroundIndex(
                (index) => (index + 1) % GROUND_LAYERS.length
            );
        }, 300);

        return () => clearInterval(interval);
    }, []);

    const getTileStyle = (
        tileId: number,
        tileIndex: number,
        layerWidth: number
    ) => {
        const tileRow = Math.floor(tileId / TILESET_WIDTH_IN_TILES);
        const tileCol = tileId % TILESET_WIDTH_IN_TILES;
        const backgroundPositionX = -tileCol * TILE_SIZE;
        const backgroundPositionY = -tileRow * TILE_SIZE;

        const x = (tileIndex % layerWidth) * TILE_SIZE;
        const y = Math.floor(tileIndex / layerWidth) * TILE_SIZE;

        return {
            width: `${TILE_SIZE}px`,
            height: `${TILE_SIZE}px`,
            backgroundImage: `url(${TILESET_IMAGE})`,
            backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
            top: `${y}px`,
            left: `${x}px`,
        };
    };

    const renderTiles = (layerName: string, isObjectLayer = false) => {
        const layer = mapData.layers.find((layer) => layer.name === layerName);
        if (!layer) return null;

        return layer.data.map((tileId, tileIndex) => {
            if (tileId === 0) return null;
            const tileStyle = getTileStyle(tileId - 1, tileIndex, layer.width);
            return (
                <div
                    key={`${
                        isObjectLayer ? "object" : "ground"
                    }-tile-${tileIndex}`}
                    style={tileStyle}
                    className="absolute"
                />
            );
        });
    };

    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="relative">
                <div
                    className="relative rounded-xl overflow-clip"
                    style={{
                        width: `${mapData.width * TILE_SIZE}px`,
                        height: `${mapData.height * TILE_SIZE}px`,
                        transform: `scale(${SCALE_FACTOR})`,
                        transformOrigin: "center center",
                    }}
                >
                    {renderTiles(GROUND_LAYERS[currentGroundIndex])}
                    {renderTiles("Objects", true)}
                    <Character
                        enabled={enabled}
                        tag={tag}
                        handleShopModal={handleShopModal}
                    />
                </div>
            </div>
        </div>
    );
};

export default GameScene;
