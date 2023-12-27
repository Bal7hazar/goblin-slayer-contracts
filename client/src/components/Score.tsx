import React from "react";
import large from "../assets/large-straight.png";
import small from "../assets/small-straight.png";
import full from "../assets/full-house.png";
import pair from "../assets/pair.png";
import double from "../assets/double.png";
import toak from "../assets/toak.png";
import foak from "../assets/foak.png";
import yahtzee from "../assets/yahtzee.png";

interface ScoreProps {
    category: number;
}

const Score: React.FC<ScoreProps> = ({ category }) => {
    const images = {
        7: pair,
        8: double,
        9: toak,
        10: foak,
        11: full,
        12: small,
        13: large,
        14: yahtzee,
    };

    return (
        <div className="flex justify-center h-8">
            {Object.values(images).map((image, index) => (
                <img
                    key={index}
                    className={
                        images[category as keyof typeof images] === image
                            ? "opacity-90"
                            : "opacity-20"
                    }
                    src={image}
                    alt=""
                />
            ))}
        </div>
    );
};

export default Score;
