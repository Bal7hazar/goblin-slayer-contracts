import React, { useState, useEffect } from 'react';
import mapData from '../assets/layers.json';
import TILESET_IMAGE from '../assets/tileset.png';

const TILE_SIZE = 16; // La taille de la tuile en pixels
const TILESET_WIDTH_IN_TILES = 27; // Nombre de tuiles en largeur dans votre tileset
const GROUND_LAYERS = ['Ground-1', 'Ground-2', 'Ground-3', 'Ground-4']; // Noms des couches de sol
const SCALE_FACTOR = 1.5; // Facteur d'échelle pour la carte

const GameScene = () => {
    const [currentGroundIndex, setCurrentGroundIndex] = useState(0); // Indice de la couche de sol actuelle

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGroundIndex(index => (index + 1) % GROUND_LAYERS.length);
        }, 300);

        return () => clearInterval(interval);
    }, []);

    const getTileStyle = (tileId: number, tileIndex: number, layerWidth: number) => {
        // Calculez la position de la tuile dans le tileset
        const tileRow = Math.floor(tileId / TILESET_WIDTH_IN_TILES);
        const tileCol = tileId % TILESET_WIDTH_IN_TILES;
        const backgroundPositionX = -tileCol * TILE_SIZE;
        const backgroundPositionY = -tileRow * TILE_SIZE;

        // Calculez la position de la tuile sur la carte
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

    // Rendre les tuiles pour la couche de sol et les objets
    const renderTiles = (layerName: string, isObjectLayer = false) => {
        const layer = mapData.layers.find(layer => layer.name === layerName);
        if (!layer) return null;

        return layer.data.map((tileId, tileIndex) => {
            if (tileId === 0) return null;
            const tileStyle = getTileStyle(tileId - 1, tileIndex, layer.width);
            return (
                <div
                    key={`${isObjectLayer ? 'object' : 'ground'}-tile-${tileIndex}`}
                    style={tileStyle}
                    className="absolute"
                />
            );
        });
    };

    return (
        <div className="flex justify-center items-start w-full">
            <div className="lg:scale-150 origin-top">
                <div
                    className="relative"
                    style={{
                        width: `${mapData.width * TILE_SIZE}px`,
                        height: `${mapData.height * TILE_SIZE}px`,
                        transform: `scale(${SCALE_FACTOR})`,
                        transformOrigin: 'top center'
                    }}
                >
                    {renderTiles(GROUND_LAYERS[currentGroundIndex])}
                    {renderTiles('Objects', true)}
                </div>
            </div>
        </div>
    );
};

export default GameScene;
