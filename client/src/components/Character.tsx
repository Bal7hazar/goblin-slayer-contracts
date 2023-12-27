import React, { useState, useEffect, useRef } from "react";

const SPRITE_SIZE = 32;
const TILE_SIZE = 16;
const ACTIONS: { [key: string]: number[] } = {
    STANDING: [0, 1],
    WALKING: [2, 3, 4],
    SWORD_ATTACK: [5, 6, 7, 8],
};
const MAP_BOUNDS = { minX: 8, maxX: 216, minY: 0, maxY: 212 };

const HILL_TILES = new Set([
    "56,36",
    "72,36",
    "88,36",
    "104,36",
    "120,36",
    "136,36",
    "152,36",
    "168,36",
    "184,36",
    "184,52",
    "184,68",
    "184,84",
    "184,100",
    "184,116",
    "184,132",
    "184,148",
    "184,164",
    "168,164",
    "152,164",
    "136,164",
    "120,164",
    "104,164",
    "88,164",
    "72,164",
    "56,164",
    "56,148",
    "56,132",
    "56,116",
    "56,84",
    "56,68",
    "56,52",
    "120,116",
    "136,116",
    "136,100",
    "136,84",
    "120,84",
    "104,84",
    "104,100",
    "104,116",
]);

const WATER_TILES = new Set([
    "88,68",
    "104,68",
    "120,68",
    "136,68",
    "152,68",
    "152,84",
    "152,100",
    "152,116",
    "152,132",
    "136,132",
    "120,132",
    "104,132",
    "88,132",
    "88,116",
    "88,100",
    "88,84",
    "120,180",
    "120,212",
]);

const GRASS_TILES = new Set([
    "136,212",
    "104,212",
    "88,212",
    "72,212",
    "56,212",
    "40,212",
    "24,212",
    "8,212",
    "8,196",
    "8,180",
    "40,180",
    "56,180",
    "72,180",
    "88,180",
    "104,180",
    "168,180",
    "184,180",
    "200,180",
    "200,164",
    "200,148",
    "200,132",
    "200,116",
    "200,100",
    "200,84",
    "200,68",
    "200,52",
    "200,36",
    "200,20",
    "184,20",
    "168,20",
    "152,20",
    "136,20",
    "120,20",
    "104,20",
    "88,20",
    "72,20",
    "56,20",
    "40,20",
    "8,4",
    "8,20",
    "8,36",
    "8,52",
    "8,68",
    "8,84",
    "8,100",
    "8,116",
    "8,132",
    "8,148",
    "8,164",
    "40,164",
    "40,148",
    "40,132",
    "40,116",
    "40,68",
    "40,52",
    "40,36",
    "72,116",
    "72,132",
    "72,148",
    "88,148",
    "104,148",
    "136,148",
    "152,148",
    "168,148",
    "168,132",
    "168,116",
    "168,100",
    "168,84",
    "168,68",
    "168,52",
    "152,52",
    "136,52",
    "120,52",
    "104,52",
    "88,52",
    "72,52",
    "72,68",
    "72,84",
    "120,100",
]);

const OBJECT_TILES = new Set(["136,180", "40,84"]);

const SHOP_DRECTION_INDEX = 4;
const SHOP_TILES = new Set(["40,4"]);

const SIGN_DRECTION_INDEX = 4;
const SIGN_TILES = new Set(["56,4", "40,100", "136,196"]);

const TUNNEL_IN_DRECTION_INDEX = 4;
const TUNNEL_IN_TILES = new Set(["152,180"]);

const TUNNEL_OUT_DRECTION_INDEX = 4;
const TUNNEL_OUT_TILES = new Set(["120,100"]);

interface TProps {
    enabled: boolean;
    tag: number;
    handleDuelModal: () => void;
    handleShopModal: () => void;
    handleLeaderboard: () => void;
}

const Character = (props: TProps) => {
    const {
        enabled,
        tag,
        handleDuelModal,
        handleShopModal,
        handleLeaderboard,
    } = props;
    const [action, setAction] = useState("STANDING");
    const [stepIndex, setStepIndex] = useState(0);
    const positionRef = useRef({ x: 40, y: 4 });
    const directionIndexRef = useRef(0);
    const isMovingRef = useRef(false); // Use to avoid spamming the movement

    const isMoveAllowed = (x: number, y: number) => {
        if (
            x < MAP_BOUNDS.minX ||
            x > MAP_BOUNDS.maxX ||
            y < MAP_BOUNDS.minY ||
            y > MAP_BOUNDS.maxY
        ) {
            return false;
        }
        if (
            HILL_TILES.has(`${x},${y}`) ||
            WATER_TILES.has(`${x},${y}`) ||
            OBJECT_TILES.has(`${x},${y}`)
        ) {
            return false;
        }
        return true;
    };

    const handleKeyDown = (event: any) => {
        if (isMovingRef.current) return;
        isMovingRef.current = true;

        let newX = positionRef.current.x;
        let newY = positionRef.current.y;

        switch (event.key) {
            case "w":
                newY -= TILE_SIZE;
                directionIndexRef.current = 4;
                break;
            case "a":
                newX -= TILE_SIZE;
                directionIndexRef.current = 6;
                break;
            case "s":
                newY += TILE_SIZE;
                directionIndexRef.current = 0;
                break;
            case "d":
                newX += TILE_SIZE;
                directionIndexRef.current = 2;
                break;
            case "q":
                setAction("SWORD_ATTACK");
                setStepIndex(0);
                isMovingRef.current = true;
                setTimeout(() => {
                    isMovingRef.current = false;
                    setAction("STANDING");
                    if (GRASS_TILES.has(`${newX},${newY}`)) {
                        handleDuelModal();
                    }
                }, ACTIONS.SWORD_ATTACK.length * 200);
                return;
            case "e":
                if (
                    SHOP_TILES.has(`${newX},${newY}`) &&
                    directionIndexRef.current == SHOP_DRECTION_INDEX
                ) {
                    handleShopModal();
                } else if (
                    SIGN_TILES.has(`${newX},${newY}`) &&
                    directionIndexRef.current == SIGN_DRECTION_INDEX
                ) {
                    handleLeaderboard();
                } else if (
                    TUNNEL_IN_TILES.has(`${newX},${newY}`) &&
                    directionIndexRef.current == TUNNEL_IN_DRECTION_INDEX
                ) {
                    newX = 120;
                    newY = 100;
                    directionIndexRef.current = 0;
                    break;
                } else if (
                    TUNNEL_OUT_TILES.has(`${newX},${newY}`) &&
                    directionIndexRef.current == TUNNEL_OUT_DRECTION_INDEX
                ) {
                    newX = 152;
                    newY = 180;
                    directionIndexRef.current = 0;
                    break;
                }
                isMovingRef.current = false;
                return;
            default:
                isMovingRef.current = false;
                return;
        }

        if (!isMoveAllowed(newX, newY)) {
            isMovingRef.current = false;
            return;
        }

        let newAction = "WALKING";
        positionRef.current = { x: newX, y: newY };
        setAction(newAction);
        setTimeout(() => {
            isMovingRef.current = false;
        }, 450);
        setTimeout(() => {
            if (isMovingRef.current) return;
            setAction("STANDING");
        }, 500);
    };

    useEffect(() => {
        if (!enabled) return;
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [enabled]);

    useEffect(() => {
        const steps = ACTIONS[action];
        const interval = setInterval(() => {
            setStepIndex((prevIndex) => (prevIndex + 1) % steps.length);
        }, 200);

        return () => clearInterval(interval);
    }, [action]);

    const getStyle = () => {
        const actionSteps = ACTIONS[action];
        const step = actionSteps[stepIndex];

        return {
            width: `${SPRITE_SIZE}px`,
            height: `${SPRITE_SIZE}px`,
            backgroundImage: `url(/src/assets/slayer-${tag}.png)`,
            backgroundPosition: `-${step * SPRITE_SIZE}px -${
                directionIndexRef.current * SPRITE_SIZE
            }px`,
            top: `${positionRef.current.y}px`,
            left: `${positionRef.current.x}px`,
            transition: "top 0.5s linear, left 0.5s linear",
        };
    };

    return <div className="absolute" style={getStyle()} />;
};

export default Character;
