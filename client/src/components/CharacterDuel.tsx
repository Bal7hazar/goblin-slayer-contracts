import React, { useState, useEffect, useRef } from "react";

const SPRITE_SIZE = 128;

const ACTIONS: { [key: string]: number[] } = {
    STANDING: [0, 1],
    WALKING: [2, 3, 4],
    SWORD_ATTACK: [5, 6, 7, 8],
    DYING: [19, 20, 21, 22, 23, 24],
    JUMPING: [25, 28],
};

interface TProps {
    image: string;
    directionIndex: number;
    action: string;
}

const CharacterDuel = (props: TProps) => {
    const { image, directionIndex, action } = props;
    const [stepIndex, setStepIndex] = useState(0);
    const positionRef = useRef({ x: 40, y: 4 });

    useEffect(() => {
        const steps = ACTIONS[action];
        const interval = setInterval(() => {
            setStepIndex((prevIndex) => {
                if (action == "DYING") {
                    return Math.min(prevIndex + 1, steps.length);
                }
                return (prevIndex + 1) % steps.length;
            });
        }, 200);

        return () => clearInterval(interval);
    }, [action]);

    const getStyle = () => {
        const steps = ACTIONS[action];
        const step = steps[stepIndex];

        return {
            width: `${SPRITE_SIZE}px`,
            height: `${SPRITE_SIZE}px`,
            backgroundImage: `url(${image})`,
            backgroundPosition: `-${step * SPRITE_SIZE}px -${
                directionIndex * SPRITE_SIZE
            }px`,
            top: `${positionRef.current.y}px`,
            left: `${positionRef.current.x}px`,
            transition: "top 0.5s linear, left 0.5s linear",
        };
    };

    return <div className="absolute" style={getStyle()} />;
};

export default CharacterDuel;
