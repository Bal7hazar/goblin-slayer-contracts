import { useEffect, useState } from "react";
import { client } from "../server";

export const useTerraformer = () => {
    const [image, setImage] = useState("");
    const [background, setBackground] = useState("");
    const [portrait, setPortrait] = useState("");

    useEffect(() => {
        const backgrounds = async () => {
            const background = await client.world.image.query({
                name: "sky view of a clearing in a forest, empty space for battle in arena, no character, japanese anime style",
            });

            setBackground(background[0]);
        };

        backgrounds();
    }, []);

    useEffect(() => {
        const input = async () => {
            const background = await client.world.image.query({
                name: "powerful hobgoblin in fighting stance with dark green skin, no clothes, no armor, centered, ready to fight, looking on the right, japanese anime style, white background",
            });
            setImage(background[0]);
        };

        input();
    }, []);

    useEffect(() => {
        const input = async () => {
            const portrait = await client.world.image.query({
                name: "powerful armored adventurer in fighting stance, centered, slayer, red and grey color theme, ready to fight, looking on the left, japanese anime style, white background",
            });

            setPortrait(portrait[0]);
        };

        input();
    }, []);

    return {
        image,
        background,
        portrait,
    };
};
