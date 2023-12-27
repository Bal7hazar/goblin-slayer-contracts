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
    const images = [pair, double, toak, foak, full, small, large, yahtzee];

    // Helpers

    const getCategory = (category: number) => {
        switch (category) {
            case 0:
                return "none";
            case 1:
                return "ones";
            case 2:
                return "twos";
            case 3:
                return "threes";
            case 4:
                return "fours";
            case 5:
                return "fives";
            case 6:
                return "sixs";
            case 7:
                return "pair";
            case 8:
                return "double";
            case 9:
                return "toak";
            case 10:
                return "foak";
            case 11:
                return "full";
            case 12:
                return "small";
            case 13:
                return "large";
            case 14:
                return "yahtzee";
            case 15:
                return "chance";
            default:
                return "none";
        }
    };

    return (
        <div className="flex justify-center h-8">
            {images.map((image, index) => (
                <img
                    key={index}
                    className={
                        image.includes(getCategory(category))
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
